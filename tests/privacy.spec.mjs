import { expect, test } from '@playwright/test';
import { shieldGoogle, trackConsole } from './browser-guard.mjs';

const GENERIC = 'Illinois Care Guide';

function installPrivacyHooks(page, { allowNonProd = false, consent = '', dnt = false, gpc = false, config = null } = {}) {
  return page.addInitScript((options) => {
    if (options.allowNonProd) window.ICG_ANALYTICS_ALLOW_NON_PROD = true;
    if (options.config) window.ICG_ANALYTICS_CONFIG = options.config;
    if (options.consent) localStorage.setItem('icg-analytics-consent', options.consent);
    localStorage.setItem('icg-language', 'en');
    if (options.dnt) {
      Object.defineProperty(Navigator.prototype, 'doNotTrack', { configurable: true, get: () => '1' });
    }
    if (options.gpc) {
      Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { configurable: true, get: () => true });
    }
  }, { allowNonProd, consent, dnt, gpc, config });
}

async function trackedPage(page, options) {
  const hits = [];
  const errors = trackConsole(page);
  await shieldGoogle(page, hits);
  await installPrivacyHooks(page, options);
  return { hits, errors };
}

test('no analytics requests before consent, after decline, or on localhost', async ({ page }) => {
  const { hits, errors } = await trackedPage(page, { allowNonProd: true });
  await page.goto('/?q=ZZSENSITIVE#checklist');
  await page.locator('#term-search').fill('ZZSENSITIVE chest pain');
  await page.locator('[data-check="3"]').check();
  const desktopTerms = page.locator('.desktop-nav a[href="#terms"]');
  if (await desktopTerms.isVisible()) await desktopTerms.click();
  else {
    await page.locator('.menu-button').click();
    await page.locator('#mobile-nav a[href="#terms"]').click();
  }
  expect(hits).toEqual([]);
  await expect(page.locator('#consent-accept')).toBeVisible();
  await page.locator('#consent-decline').click();
  await expect(page.locator('#consent-accept')).toHaveCount(0);
  expect(hits).toEqual([]);
  await page.reload();
  await page.locator('#term-search').fill('symptom');
  expect(hits).toEqual([]);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('icg-analytics-consent'))).toBe('denied');
  expect(errors).toEqual([]);
});

test('localhost and preview hosts do not load Google even after acceptance', async ({ page }) => {
  const { hits } = await trackedPage(page, { consent: 'granted' });
  await page.goto('/');
  await page.locator('#term-search').fill('copay');
  await page.locator('[data-check="0"]').check();
  expect(hits).toEqual([]);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});

test('accepted visit count is one sanitized homepage page view', async ({ page }) => {
  const { hits, errors } = await trackedPage(page, { allowNonProd: true });
  await page.route('**/gtag/js**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: `(() => {
      const send = (params) => {
        const usp = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== '') usp.append(key, String(params[key]));
        });
        navigator.sendBeacon('https://www.google-analytics.com/g/collect?' + usp.toString());
      };
      send({
        en: 'user_engagement',
        dl: location.href,
        dt: document.title,
        dr: document.referrer,
        'ep.search_term': 'ZZSENSITIVE',
        uid: 'user-123'
      });
      send({ en: 'scroll', dl: location.href, 'ep.link_url': location.href });
      (window.dataLayer || []).forEach((args) => {
        if (args && args[0] === 'event' && args[1] === 'page_view') {
          const params = args[2] || {};
          send({
            en: 'page_view',
            dl: params.page_location || location.href,
            dt: params.page_title || document.title,
            dr: params.page_referrer || ''
          });
        }
      });
    })();`
  }));
  await page.goto('/?q=ZZSENSITIVE#checklist', { referer: 'https://search.example/results?q=ZZSENSITIVE' });
  await page.locator('#term-search').fill('ZZSENSITIVE chest pain');
  await page.locator('[data-check="4"]').check();
  expect(hits).toEqual([]);
  await page.locator('#consent-accept').click();
  await expect.poll(() => hits.length).toBeGreaterThan(0);
  const urls = hits.map((hit) => hit.url);
  const events = urls.map((url) => new URL(url).searchParams.get('en'));
  expect(events.every((name) => ['page_view', 'session_start', 'user_engagement', 'first_visit'].includes(name))).toBeTruthy();
  expect(events.filter((name) => name === 'page_view').length).toBeLessThanOrEqual(1);
  expect(events).not.toContain('scroll');
  for (const url of urls) {
    const params = new URL(url).searchParams;
    expect(url).not.toContain('ZZSENSITIVE');
    expect(url).not.toContain('checklist');
    expect(url).not.toContain('insure@');
    expect(url).not.toContain('217-333-2700');
    expect(params.get('dt')).toBe(GENERIC);
    expect(params.get('dl') || '').not.toContain('?');
    expect(params.get('dl') || '').not.toContain('#');
    const referrer = params.get('dr');
    if (referrer) {
      const referrerUrl = new URL(referrer);
      expect(referrerUrl.origin).toBe(referrer);
      expect(referrerUrl.search).toBe('');
      expect(referrerUrl.hash).toBe('');
      expect(referrerUrl.pathname === '/' || referrerUrl.pathname === '').toBeTruthy();
    }
    expect(params.get('uid')).toBeNull();
    expect(params.get('ep.search_term')).toBeNull();
  }
  const queued = await page.evaluate(() => (window.dataLayer || []).filter((args) => args && (args[0] === 'consent' || args[0] === 'config' || args[0] === 'event')).map((args) => ({
    command: args[0],
    name: args[1],
    params: args[2] || null
  })));
  const consent = queued.find((item) => item.command === 'consent');
  expect(consent.params.ad_storage).toBe('denied');
  expect(consent.params.ad_user_data).toBe('denied');
  expect(consent.params.ad_personalization).toBe('denied');
  expect(consent.params.analytics_storage).toBe('granted');
  const config = queued.find((item) => item.command === 'config');
  expect(config.name).toBe('G-68T1ZEGEJX');
  expect(config.params.send_page_view).toBe(false);
  expect(config.params.allow_google_signals).toBe(false);
  expect(config.params.allow_ad_personalization_signals).toBe(false);
  expect(config.params.page_title).toBe(GENERIC);
  const names = queued.filter((item) => item.command === 'event').map((item) => item.name);
  expect(names).toEqual(['page_view']);
  expect(errors).toEqual([]);
});

test('revoke deletes Analytics cookies, reloads, and sends nothing further', async ({ page }) => {
  const { hits } = await trackedPage(page, { allowNonProd: true });
  await page.route('**/gtag/js**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.__gtagLoaded = true;'
  }));
  await page.goto('/');
  await page.locator('#consent-accept').click();
  await expect.poll(() => page.evaluate(() => window.__gtagLoaded === true)).toBeTruthy();
  await page.evaluate(() => {
    document.cookie = '_ga=GA1.1.111.222; path=/';
    document.cookie = '_ga_68T1ZEGEJX=GS1.1.test; path=/';
  });
  const beforeReload = hits.length;
  await page.locator('#privacy-open').click();
  await page.locator('#privacy-revoke').click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('#lang-button')).toBeVisible();
  const cookie = await page.evaluate(() => document.cookie);
  expect(cookie).not.toContain('_ga');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('icg-analytics-consent'))).toBe('denied');
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect(hits.length).toBe(beforeReload);
});

test('Do Not Track and Global Privacy Control block measurement', async ({ page }) => {
  const dnt = await trackedPage(page, { allowNonProd: true, consent: 'granted', dnt: true });
  await page.goto('/');
  await expect(page.locator('#consent-title')).toContainText(/Visit counting stays off|Do Not Track|Global Privacy Control/i);
  await expect(page.locator('#consent-accept')).toHaveCount(0);
  expect(dnt.hits).toEqual([]);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);

  const gpcPage = await page.context().newPage();
  const gpc = [];
  await shieldGoogle(gpcPage, gpc);
  await installPrivacyHooks(gpcPage, { allowNonProd: true, consent: 'granted', gpc: true });
  await gpcPage.goto('/');
  await expect(gpcPage.locator('#consent-accept')).toHaveCount(0);
  expect(gpc).toEqual([]);
  await gpcPage.close();
});

test('an invalid measurement id never starts a request', async ({ page }) => {
  const { hits } = await trackedPage(page, {
    allowNonProd: true,
    config: { provider: 'ga4', measurementId: 'GTM-NOTGA4' }
  });
  await page.goto('/');
  await page.locator('#consent-accept').click();
  await page.locator('#term-search').fill('copay');
  expect(hits).toEqual([]);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});
