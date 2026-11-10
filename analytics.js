(function (root) {
  var GENERIC_TITLE = 'Illinois Care Guide';
  var PRODUCTION_HOSTS = { 'shroudxk.github.io': true };
  var CONSENT_KEY = 'icg-analytics-consent';
  var SIGNAL_DISMISS_KEY = 'icg-analytics-signal-dismissed';
  var ALLOWED_EVENTS = { page_view: true, session_start: true, user_engagement: true, first_visit: true };
  var ALLOWED_EP = { engagement_time_msec: true, session_engaged: true, page_location: true, page_referrer: true, page_title: true };
  var MEASUREMENT_RE = /^G-[A-Z0-9]+$/;

  function isValidMeasurementId(id) {
    return typeof id === 'string' && MEASUREMENT_RE.test(id) && id.indexOf('GTM-') !== 0;
  }

  function readConfig(config) {
    var source = config || root.ICG_ANALYTICS_CONFIG || {};
    var provider = source.provider === 'ga4' ? 'ga4' : '';
    var measurementId = isValidMeasurementId(source.measurementId) ? source.measurementId : '';
    return {
      provider: provider,
      measurementId: measurementId,
      valid: provider === 'ga4' && !!measurementId
    };
  }

  function hasPrivacySignal(nav, win) {
    var n = nav || {};
    var w = win || {};
    var dnt = n.doNotTrack || w.doNotTrack || n.msDoNotTrack;
    if (dnt === '1' || dnt === 'yes') return true;
    return n.globalPrivacyControl === true;
  }

  function hostAllowed(hostname, allowNonProd) {
    if (allowNonProd === true) return true;
    return !!PRODUCTION_HOSTS[String(hostname || '').toLowerCase()];
  }

  function canonicalPageUrl(href) {
    try {
      var url = new URL(href);
      url.search = '';
      url.hash = '';
      var path = url.pathname || '/';
      if (path.slice(-11) === '/index.html') path = path.slice(0, -10);
      if (path.slice(-10) === 'index.html') path = path.slice(0, -10);
      return url.origin + path;
    } catch (err) {
      return '';
    }
  }

  function referrerOrigin(referrer) {
    if (!referrer) return '';
    try {
      var url = new URL(referrer);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
      return url.origin;
    } catch (err) {
      return '';
    }
  }

  function shouldMeasure(options) {
    var opts = options || {};
    var config = readConfig(opts.config);
    if (!config.valid) return false;
    if (opts.consent !== 'granted') return false;
    if (opts.privacySignal) return false;
    if (!hostAllowed(opts.hostname, opts.allowNonProd)) return false;
    return true;
  }

  function consentState() {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted'
    };
  }

  function deniedConsentState() {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted'
    };
  }

  function buildGaConfig(href, referrer) {
    var params = {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
      restricted_data_processing: true,
      ads_data_redaction: true,
      page_location: canonicalPageUrl(href),
      page_title: GENERIC_TITLE,
      cookie_flags: 'SameSite=Lax;Secure'
    };
    var origin = referrerOrigin(referrer);
    if (origin) params.page_referrer = origin;
    return params;
  }

  function buildPageViewParams(href, referrer) {
    var params = {
      page_location: canonicalPageUrl(href),
      page_title: GENERIC_TITLE
    };
    var origin = referrerOrigin(referrer);
    if (origin) params.page_referrer = origin;
    return params;
  }

  function isOriginOnly(value) {
    try {
      var url = new URL(value);
      return (url.protocol === 'http:' || url.protocol === 'https:') &&
        !url.search && !url.hash &&
        (url.pathname === '/' || url.pathname === '') &&
        value.replace(/\/$/, '') === url.origin;
    } catch (err) {
      return false;
    }
  }

  function looksSensitive(value) {
    var text = String(value || '');
    if (!text) return false;
    if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) return true;
    return false;
  }

  function sanitizeParams(params) {
    var events = params.getAll('en');
    if (!events.length || events.some(function (name) { return !ALLOWED_EVENTS[name]; })) {
      return { blocked: true, reason: events.length ? 'event' : 'missing-event' };
    }
    var sensitive = false;
    params.forEach(function (value) {
      if (looksSensitive(value)) sensitive = true;
    });
    if (sensitive) return { blocked: true, reason: 'sensitive' };
    var keys = [];
    params.forEach(function (_value, key) { keys.push(key); });
    keys.forEach(function (key) {
      var lower = key.toLowerCase();
      if (lower === 'uid' || lower === 'user_id' || lower === 'gclid' || lower === 'dclid' || lower === 'wbraid' || lower === 'gbraid') {
        params.delete(key);
        return;
      }
      var dot = lower.indexOf('.');
      if (dot > 0) {
        var prefix = lower.slice(0, dot);
        var name = lower.slice(dot + 1);
        if (prefix === 'ep' || prefix === 'epn' || prefix === 'up' || prefix === 'upn') {
          if (!ALLOWED_EP[name]) params.delete(key);
        }
      }
    });
    ['dl', 'ep.page_location', 'ep.page_path'].forEach(function (key) {
      if (!params.has(key)) return;
      var clean = canonicalPageUrl(params.get(key));
      if (!clean || clean.indexOf('?') !== -1 || clean.indexOf('#') !== -1) params.delete(key);
      else params.set(key, clean);
    });
    ['dr', 'ep.page_referrer'].forEach(function (key) {
      if (!params.has(key)) return;
      var origin = referrerOrigin(params.get(key));
      if (!origin || !isOriginOnly(origin)) params.delete(key);
      else params.set(key, origin);
    });
    params.set('dt', GENERIC_TITLE);
    if (params.has('ep.page_title')) params.set('ep.page_title', GENERIC_TITLE);
    var dl = params.get('dl') || '';
    var dr = params.get('dr') || '';
    if ((dl && (dl.indexOf('?') !== -1 || dl.indexOf('#') !== -1)) || (dr && !isOriginOnly(dr))) {
      return { blocked: true, reason: 'url' };
    }
    return { blocked: false, params: params };
  }

  function paramsFromBody(body) {
    if (!body) return new URLSearchParams();
    if (typeof body === 'string') return new URLSearchParams(body);
    if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
      return new URLSearchParams(body.toString());
    }
    return new URLSearchParams();
  }

  function splitCollect(url, body) {
    var parsed = new URL(url, 'https://www.google-analytics.com');
    var params = new URLSearchParams(parsed.search);
    paramsFromBody(body).forEach(function (value, key) { params.append(key, value); });
    return { parsed: parsed, params: params };
  }

  function hostMatches(host, name) {
    return host === name || host.slice(-(name.length + 1)) === '.' + name;
  }

  function isCollectUrl(url) {
    try {
      var parsed = new URL(url, 'https://example.invalid');
      var host = parsed.hostname;
      var collectHost = hostMatches(host, 'google-analytics.com') || host === 'analytics.google.com' || hostMatches(host, 'analytics.google.com');
      if (!collectHost) return false;
      return parsed.pathname.indexOf('/g/collect') !== -1 || parsed.pathname.indexOf('/collect') !== -1 || parsed.pathname.indexOf('/mp/collect') !== -1;
    } catch (err) {
      return false;
    }
  }

  function isBlockedGoogleUrl(url) {
    try {
      var host = new URL(url, 'https://example.invalid').hostname;
      return hostMatches(host, 'doubleclick.net') || hostMatches(host, 'googleadservices.com') || hostMatches(host, 'googlesyndication.com');
    } catch (err) {
      return false;
    }
  }

  function sanitizeGaHit(url, body) {
    if (!url || isBlockedGoogleUrl(url)) return { blocked: true, reason: 'ads-host', url: url, body: body };
    if (!isCollectUrl(url)) return { blocked: false, passthrough: true, url: url, body: body };
    var parts = splitCollect(url, body);
    var result = sanitizeParams(parts.params);
    if (result.blocked) return { blocked: true, reason: result.reason, url: url, body: body };
    var next = new URL(parts.parsed.origin + parts.parsed.pathname);
    next.search = result.params.toString();
    return { blocked: false, url: next.toString(), body: null };
  }

  function gaCookieNames(measurementId) {
    var suffix = String(measurementId || '').replace(/^G-/, '');
    return ['_ga', '_gid', '_gat'].concat(suffix ? ['_ga_' + suffix] : []);
  }

  function cookieNamesToClear(measurementId, cookieString) {
    var names = {};
    gaCookieNames(measurementId).forEach(function (name) { names[name] = true; });
    String(cookieString || '').split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (!name) return;
      if (name.indexOf('_ga') === 0 || name.indexOf('_gid') === 0 || name.indexOf('_gat') === 0) names[name] = true;
    });
    return Object.keys(names);
  }

  function disableFlag(measurementId) {
    return 'ga-disable-' + measurementId;
  }

  var guardState = { active: false, pageViews: 0 };

  function setMeasurementActive(active) {
    guardState.active = !!active;
    if (!active) guardState.pageViews = 0;
  }

  function installNetworkGuard() {
    if (typeof navigator === 'undefined' || navigator.__icgGuard) return;
    navigator.__icgGuard = true;

    function decide(url, body) {
      if (isBlockedGoogleUrl(url)) return { blocked: true, reason: 'ads-host' };
      if (!isCollectUrl(url)) return { blocked: false, passthrough: true, url: url, body: body };
      if (!guardState.active) return { blocked: true, reason: 'inactive' };
      var cleaned = sanitizeGaHit(url, body);
      if (cleaned.blocked) return cleaned;
      var events = new URL(cleaned.url).searchParams.getAll('en');
      if (events.indexOf('page_view') !== -1) {
        guardState.pageViews += 1;
        if (guardState.pageViews > 1) return { blocked: true, reason: 'extra-page-view' };
      }
      return cleaned;
    }

    function bodyToString(data) {
      if (!data) return '';
      if (typeof data === 'string') return data;
      if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) return data.toString();
      return '';
    }

    if (typeof navigator.sendBeacon === 'function') {
      var origBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url, data) {
        var decision = decide(String(url), bodyToString(data));
        if (decision.blocked) return true;
        if (decision.passthrough) return origBeacon(url, data);
        return origBeacon(decision.url, decision.body || undefined);
      };
    }

    if (typeof root.fetch === 'function') {
      var origFetch = root.fetch.bind(root);
      root.fetch = function (input, init) {
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        var body = init && init.body;
        var decision = decide(url, bodyToString(body));
        if (decision.blocked) return Promise.resolve(new Response('', { status: 204 }));
        if (decision.passthrough) return origFetch(input, init);
        return origFetch(decision.url, init ? Object.assign({}, init, { body: decision.body || undefined }) : undefined);
      };
    }

    if (typeof XMLHttpRequest !== 'undefined') {
      var origOpen = XMLHttpRequest.prototype.open;
      var origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url) {
        this.__icgMethod = method;
        this.__icgUrl = url;
        return origOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function (body) {
        var decision = decide(String(this.__icgUrl || ''), bodyToString(body));
        if (decision.blocked) return;
        if (!decision.passthrough && decision.url) {
          origOpen.call(this, this.__icgMethod || 'GET', decision.url, true);
          return origSend.call(this, decision.body || null);
        }
        return origSend.apply(this, arguments);
      };
    }
  }

  function clearGaCookies(measurementId) {
    if (typeof document === 'undefined') return [];
    var names = cookieNamesToClear(measurementId, document.cookie);
    var host = location.hostname;
    var domains = ['', host];
    if (host) domains.push('.' + host);
    var paths = ['/', '/uiuc-care-guide', '/uiuc-care-guide/'];
    if (location.pathname) paths.push(location.pathname);
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        paths.forEach(function (path) {
          var base = name + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + path;
          document.cookie = base + (domain ? '; domain=' + domain : '');
          document.cookie = base + '; Secure' + (domain ? '; domain=' + domain : '');
        });
      });
    });
    return names;
  }

  function loadGoogleTag(config, href, referrer) {
    var resolved = readConfig(config);
    if (!resolved.valid || typeof document === 'undefined') return false;
    root[disableFlag(resolved.measurementId)] = false;
    root.dataLayer = root.dataLayer || [];
    root.gtag = root.gtag || function () { root.dataLayer.push(arguments); };
    root.gtag('consent', 'default', consentState());
    root.gtag('js', new Date());
    root.gtag('set', 'ads_data_redaction', true);
    root.gtag('config', resolved.measurementId, buildGaConfig(href, referrer));
    root.gtag('event', 'page_view', buildPageViewParams(href, referrer));
    setMeasurementActive(true);
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(resolved.measurementId);
    script.referrerPolicy = 'origin';
    document.head.appendChild(script);
    return true;
  }

  function stopMeasurement(config) {
    var resolved = readConfig(config);
    setMeasurementActive(false);
    if (resolved.measurementId) root[disableFlag(resolved.measurementId)] = true;
    if (typeof root.gtag === 'function') {
      try { root.gtag('consent', 'update', deniedConsentState()); } catch (err) { /* ignore */ }
    }
    if (resolved.measurementId) clearGaCookies(resolved.measurementId);
  }

  root.ICGAnalytics = {
    GENERIC_TITLE: GENERIC_TITLE,
    CONSENT_KEY: CONSENT_KEY,
    SIGNAL_DISMISS_KEY: SIGNAL_DISMISS_KEY,
    isValidMeasurementId: isValidMeasurementId,
    readConfig: readConfig,
    hasPrivacySignal: hasPrivacySignal,
    hostAllowed: hostAllowed,
    canonicalPageUrl: canonicalPageUrl,
    referrerOrigin: referrerOrigin,
    shouldMeasure: shouldMeasure,
    consentState: consentState,
    deniedConsentState: deniedConsentState,
    buildGaConfig: buildGaConfig,
    buildPageViewParams: buildPageViewParams,
    sanitizeGaHit: sanitizeGaHit,
    isCollectUrl: isCollectUrl,
    isBlockedGoogleUrl: isBlockedGoogleUrl,
    gaCookieNames: gaCookieNames,
    cookieNamesToClear: cookieNamesToClear,
    disableFlag: disableFlag,
    setMeasurementActive: setMeasurementActive,
    installNetworkGuard: installNetworkGuard,
    clearGaCookies: clearGaCookies,
    loadGoogleTag: loadGoogleTag,
    stopMeasurement: stopMeasurement
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
