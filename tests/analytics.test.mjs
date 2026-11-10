import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const context = { URL, URLSearchParams, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'analytics.config.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'analytics.js'), 'utf8'), context);
const analytics = context.ICGAnalytics;

test('ships the public GA4 measurement id and rejects tag-manager ids', () => {
  assert.equal(context.ICG_ANALYTICS_CONFIG.measurementId, 'G-68T1ZEGEJX');
  assert.equal(context.ICG_ANALYTICS_CONFIG.provider, 'ga4');
  assert.equal(analytics.isValidMeasurementId('G-68T1ZEGEJX'), true);
  assert.equal(analytics.isValidMeasurementId('GTM-ABC123'), false);
  assert.equal(analytics.isValidMeasurementId('G-'), false);
  assert.equal(analytics.isValidMeasurementId(''), false);
  assert.equal(analytics.readConfig(context.ICG_ANALYTICS_CONFIG).valid, true);
  assert.equal(analytics.readConfig({ provider: 'ga4', measurementId: 'GTM-XXXX' }).valid, false);
});

test('measurement stays off without consent, on a preview host, or with a privacy signal', () => {
  const base = {
    config: context.ICG_ANALYTICS_CONFIG,
    consent: 'granted',
    privacySignal: false,
    hostname: 'shroudxk.github.io',
    allowNonProd: false
  };
  assert.equal(analytics.shouldMeasure(base), true);
  assert.equal(analytics.shouldMeasure({ ...base, consent: 'denied' }), false);
  assert.equal(analytics.shouldMeasure({ ...base, consent: '' }), false);
  assert.equal(analytics.shouldMeasure({ ...base, hostname: '127.0.0.1' }), false);
  assert.equal(analytics.shouldMeasure({ ...base, hostname: 'localhost' }), false);
  assert.equal(analytics.shouldMeasure({ ...base, hostname: 'preview.example' }), false);
  assert.equal(analytics.shouldMeasure({ ...base, hostname: '127.0.0.1', allowNonProd: true }), true);
  assert.equal(analytics.shouldMeasure({ ...base, privacySignal: true }), false);
  assert.equal(analytics.hasPrivacySignal({ doNotTrack: '1' }, {}), true);
  assert.equal(analytics.hasPrivacySignal({ globalPrivacyControl: true }, {}), true);
  assert.equal(analytics.hasPrivacySignal({ doNotTrack: '0' }, {}), false);
});

test('canonical page URL and referrer drop query, hash, and path', () => {
  assert.equal(
    analytics.canonicalPageUrl('https://shroudxk.github.io/uiuc-care-guide/?q=chest+pain#checklist'),
    'https://shroudxk.github.io/uiuc-care-guide/'
  );
  assert.equal(
    analytics.canonicalPageUrl('https://shroudxk.github.io/uiuc-care-guide/index.html?utm=1#terms'),
    'https://shroudxk.github.io/uiuc-care-guide/'
  );
  assert.equal(analytics.referrerOrigin('https://www.google.com/search?q=fever#top'), 'https://www.google.com');
  assert.equal(analytics.referrerOrigin(''), '');
  const params = analytics.buildPageViewParams(
    'https://shroudxk.github.io/uiuc-care-guide/#checklist',
    'https://search.example/results?q=secret'
  );
  assert.equal(params.page_title, 'Illinois Care Guide');
  assert.equal(params.page_location, 'https://shroudxk.github.io/uiuc-care-guide/');
  assert.equal(params.page_referrer, 'https://search.example');
  assert.equal('page_referrer' in analytics.buildPageViewParams('https://shroudxk.github.io/uiuc-care-guide/', ''), false);
  const config = analytics.buildGaConfig(
    'http://127.0.0.1:4173/?q=secret#checklist',
    'https://evil.example/path?q=secret'
  );
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.page_title, 'Illinois Care Guide');
  assert.equal(config.page_location.includes('?'), false);
  assert.equal(config.page_location.includes('#'), false);
  assert.equal(config.page_referrer, 'https://evil.example');
});

test('collect hits keep only a sanitized homepage view and allowed automatic events', () => {
  const dirty = 'https://www.google-analytics.com/g/collect?v=2&tid=G-68T1ZEGEJX&en=user_engagement' +
    '&dl=' + encodeURIComponent('https://shroudxk.github.io/uiuc-care-guide/?q=ZZSENSITIVE#checklist') +
    '&dt=' + encodeURIComponent('Illinois Care Guide · symptoms') +
    '&dr=' + encodeURIComponent('https://search.example/results?q=ZZSENSITIVE') +
    '&ep.search_term=ZZSENSITIVE&uid=user-123&ep.link_url=' + encodeURIComponent('https://shroudxk.github.io/uiuc-care-guide/#terms');
  const cleaned = analytics.sanitizeGaHit(dirty, '');
  assert.equal(cleaned.blocked, false);
  const params = new URL(cleaned.url).searchParams;
  assert.equal(params.get('en'), 'user_engagement');
  assert.equal(params.get('dl'), 'https://shroudxk.github.io/uiuc-care-guide/');
  assert.equal(params.get('dt'), 'Illinois Care Guide');
  assert.equal(params.get('dr'), 'https://search.example');
  assert.equal(params.get('ep.search_term'), null);
  assert.equal(params.get('uid'), null);
  assert.equal(params.get('ep.link_url'), null);
  assert.equal(cleaned.url.includes('ZZSENSITIVE'), false);
  assert.equal(cleaned.url.includes('#'), false);
  assert.equal(cleaned.url.includes('symptoms'), false);

  const scroll = analytics.sanitizeGaHit('https://www.google-analytics.com/g/collect?en=scroll&dl=https%3A%2F%2Fshroudxk.github.io%2Fuiuc-care-guide%2F%23checklist', '');
  assert.equal(scroll.blocked, true);

  const email = analytics.sanitizeGaHit('https://www.google-analytics.com/g/collect?en=page_view&dl=https%3A%2F%2Fshroudxk.github.io%2Fuiuc-care-guide%2F&ep.form_destination=insure%40illinois.edu', '');
  assert.equal(email.blocked, true);

  const ads = analytics.sanitizeGaHit('https://stats.g.doubleclick.net/g/collect?en=page_view', '');
  assert.equal(ads.blocked, true);

  const consent = analytics.consentState();
  assert.equal(consent.ad_storage, 'denied');
  assert.equal(consent.ad_user_data, 'denied');
  assert.equal(consent.ad_personalization, 'denied');
  assert.equal(consent.analytics_storage, 'granted');
  assert.deepEqual(JSON.parse(JSON.stringify(analytics.gaCookieNames('G-68T1ZEGEJX'))), ['_ga', '_gid', '_gat', '_ga_68T1ZEGEJX']);
  assert.deepEqual(
    JSON.parse(JSON.stringify(analytics.cookieNamesToClear('G-68T1ZEGEJX', '_ga=1; theme=light; _ga_68T1ZEGEJX=1').sort())),
    ['_ga', '_ga_68T1ZEGEJX', '_gat', '_gid']
  );
});
