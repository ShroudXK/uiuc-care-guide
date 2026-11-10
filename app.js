(function () {
  var OFFICIAL = window.ICGOfficial;
  var I18N = window.ICGI18n;
  var ANALYTICS = window.ICGAnalytics;
  var REVIEW_ISO = '2026-11-08';
  var PRIMARY_LINKS = ['#start', '#insurance', '#appointment', '#terms', '#sources'];
  var SAFE_HASH = {
    '#top': true,
    '#start': true,
    '#journey': true,
    '#insurance': true,
    '#appointment': true,
    '#terms': true,
    '#checklist': true,
    '#sources': true
  };
  var CHECK_COUNT = 6;
  var tagStarted = false;

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function hashHref(href) {
    return SAFE_HASH[href] ? href : '#top';
  }

  function external(url, label, className) {
    var cls = className == null ? 'text-link' : className;
    var classAttr = cls ? ' class="' + cls + '"' : '';
    return '<a' + classAttr + ' href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>';
  }

  function sourceLine(label, reviewed, summary, keys) {
    var linksHtml = keys.map(function (key) {
      return external(OFFICIAL[key], t.linkLabels[key] || key);
    }).join(' · ');
    return '<p class="source-line"><strong>' + esc(label) + ' · ' + esc(reviewed) + ' ' + REVIEW_ISO + '</strong> — ' + esc(summary) + '. ' + linksHtml + '</p>';
  }

  function readChecks() {
    try {
      var parsed = JSON.parse(localStorage.getItem(I18N.CHECKLIST_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.map(Number).filter(function (n) {
        return Number.isInteger(n) && n >= 0 && n < CHECK_COUNT;
      });
    } catch (err) {
      return [];
    }
  }

  function saveChecks() {
    var values = Array.prototype.map.call(document.querySelectorAll('[data-check]:checked'), function (input) {
      return Number(input.getAttribute('data-check'));
    });
    localStorage.setItem(I18N.CHECKLIST_KEY, JSON.stringify(values));
  }

  function termsMarkup(pack, query) {
    var q = String(query || '').trim().toLocaleLowerCase();
    var matching = pack.terms.filter(function (term) {
      return (term.word + ' ' + term.gloss + ' ' + term.meaning + ' ' + (term.example || '') + ' ' + term.question + ' ' + term.questionHelp)
        .toLocaleLowerCase()
        .indexOf(q) !== -1;
    });
    if (!matching.length) return '<p class="check-foot">' + esc(pack.noTerms) + '</p>';
    return matching.map(function (term) {
      var example = term.example
        ? '<small><strong>' + esc(pack.exampleLabel) + '</strong> ' + esc(term.example) + '</small>'
        : '';
      return '<details class="term"><summary>' + esc(term.word) + ' · ' + esc(term.gloss) + '</summary><p>' +
        esc(term.meaning) + example +
        '<small>' + esc(pack.askLabel) + ' <span lang="en">“' + esc(term.question) + '”</span></small>' +
        '<small><strong>' + esc(pack.questionHelpLabel) + '</strong> ' + esc(term.questionHelp) + '</small></p></details>';
    }).join('');
  }

  function privacySignal() {
    return ANALYTICS.hasPrivacySignal(navigator, window);
  }

  function consentValue() {
    var value = localStorage.getItem(ANALYTICS.CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : '';
  }

  function allowNonProd() {
    return window.ICG_ANALYTICS_ALLOW_NON_PROD === true;
  }

  function measurementOn() {
    return ANALYTICS.shouldMeasure({
      config: window.ICG_ANALYTICS_CONFIG,
      consent: consentValue(),
      privacySignal: privacySignal(),
      hostname: location.hostname,
      allowNonProd: allowNonProd()
    });
  }

  function maybeStartAnalytics() {
    var config = ANALYTICS.readConfig(window.ICG_ANALYTICS_CONFIG);
    if (!measurementOn()) {
      if (config.measurementId) window[ANALYTICS.disableFlag(config.measurementId)] = true;
      return;
    }
    if (tagStarted) return;
    tagStarted = true;
    ANALYTICS.loadGoogleTag(window.ICG_ANALYTICS_CONFIG, location.href, document.referrer);
  }

  var storedLanguage = null;
  try { storedLanguage = localStorage.getItem(I18N.LANGUAGE_KEY); } catch (err) { storedLanguage = null; }
  var browserLanguages = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
  var resolvedLanguage = I18N.resolveLanguage(storedLanguage, browserLanguages);
  var language = resolvedLanguage.lang;
  if (!window.ICG_LOCALES[language]) language = 'en';
  if (resolvedLanguage.explicit && resolvedLanguage.migratedFrom) {
    try { localStorage.setItem(I18N.LANGUAGE_KEY, language); } catch (err) { /* ignore */ }
  }

  var t = window.ICG_LOCALES[language];
  var app = document.getElementById('app');

  function setLanguage(next) {
    if (!window.ICG_LOCALES[next]) return;
    if (next === language) {
      closeLangMenu(true);
      return;
    }
    var hash = location.hash;
    var y = window.scrollY;
    language = next;
    try { localStorage.setItem(I18N.LANGUAGE_KEY, language); } catch (err) { /* ignore */ }
    render();
    var target = hash && SAFE_HASH[hash] ? document.querySelector(hash) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, y);
    var button = document.getElementById('lang-button');
    if (button) button.focus();
  }

  function closeLangMenu(focusButton) {
    var menu = document.getElementById('lang-menu');
    var button = document.getElementById('lang-button');
    if (menu) menu.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
    if (focusButton && button) button.focus();
  }

  function openLangMenu(which) {
    var menu = document.getElementById('lang-menu');
    var button = document.getElementById('lang-button');
    var mobile = document.querySelector('.mobile-nav');
    var menuButton = document.querySelector('.menu-button');
    if (mobile) mobile.classList.remove('open');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    if (!menu || !button) return;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    var options = menu.querySelectorAll('[role="option"]');
    var selected = menu.querySelector('[aria-selected="true"]') || options[0];
    var target = which === 'last' ? options[options.length - 1] : selected;
    if (target) target.focus();
  }

  function renderConsent(pack) {
    var consent = consentValue();
    var signal = privacySignal();
    var dismissed = localStorage.getItem(ANALYTICS.SIGNAL_DISMISS_KEY) === '1';
    if (signal && !dismissed) {
      return '<div class="consent-banner" id="consent-banner" role="region" aria-labelledby="consent-title">' +
        '<h2 id="consent-title">' + esc(pack.privacySignalTitle) + '</h2>' +
        '<p>' + esc(pack.privacySignalBody) + '</p>' +
        '<div class="consent-actions"><button type="button" class="button button-light" id="signal-dismiss">' + esc(pack.privacySignalDismiss) + '</button></div></div>';
    }
    if (!signal && consent !== 'granted' && consent !== 'denied') {
      return '<div class="consent-banner" id="consent-banner" role="region" aria-labelledby="consent-title">' +
        '<h2 id="consent-title">' + esc(pack.consentTitle) + '</h2>' +
        '<p>' + esc(pack.consentSummary) + '</p>' +
        '<div class="consent-actions">' +
        '<button type="button" class="button button-primary" id="consent-accept">' + esc(pack.consentAccept) + '</button>' +
        '<button type="button" class="button button-light" id="consent-decline">' + esc(pack.consentDecline) + '</button>' +
        '<button type="button" class="privacy-text" id="consent-details">' + esc(pack.consentDetails) + '</button>' +
        '</div></div>';
    }
    return '';
  }

  function renderPrivacyDialog(pack) {
    var consent = consentValue();
    var signal = privacySignal();
    var status = pack.privacyNotCounting;
    if (signal) status = pack.privacySignalBody;
    else if (consent === 'granted') status = pack.privacyGranted;
    else if (consent === 'denied') status = pack.privacyDenied;
    var actions = '';
    if (!signal && consent !== 'granted') {
      actions += '<button type="button" class="button button-primary" id="privacy-accept">' + esc(pack.consentAccept) + '</button>';
    }
    if (!signal && !consent) {
      actions += '<button type="button" class="button button-light" id="privacy-decline">' + esc(pack.consentDecline) + '</button>';
    }
    if (consent === 'granted') {
      actions += '<button type="button" class="button button-light" id="privacy-revoke">' + esc(pack.privacyRevoke) + '</button>';
    }
    actions += '<button type="button" class="button button-light" id="privacy-close">' + esc(pack.privacyClose) + '</button>';
    return '<dialog id="privacy-dialog" aria-labelledby="privacy-title">' +
      '<h2 id="privacy-title">' + esc(pack.privacyTitle) + '</h2>' +
      '<p>' + esc(pack.consentBody) + '</p>' +
      '<p id="privacy-status">' + esc(status) + '</p>' +
      (consent === 'granted' ? '<p>' + esc(pack.privacyRevokeHelp) + '</p>' : '') +
      '<div class="consent-actions">' + actions + '</div></dialog>';
  }

  function render() {
    t = window.ICG_LOCALES[language];
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.title;
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t.description);
    var skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = t.skipLink;

    var colon = t.colon;
    var emergencyList = t.emergencyItems.map(function (item) {
      return '<li><strong>' + esc(item[0]) + colon + '</strong> ' + item[1] + '</li>';
    }).join('');
    var checked = readChecks();

    app.innerHTML =
      '<header class="site-header">' +
        '<div class="topline"><div class="shell"><span>' + esc(t.top) + '</span><span>' + esc(t.topRight) + '</span></div></div>' +
        '<div class="shell header-inner">' +
          '<a class="brand" href="#top" aria-label="' + esc(t.homeAria) + '"><span class="brand-mark" aria-hidden="true">✳</span>Illinois Care Guide</a>' +
          '<nav class="desktop-nav" aria-label="' + esc(t.navPrimary) + '">' + t.nav.map(function (label, i) {
            return '<a href="' + PRIMARY_LINKS[i] + '">' + esc(label) + '</a>';
          }).join('') + '</nav>' +
          '<div class="header-actions">' +
            '<a class="emergency-link" href="tel:911">' + esc(t.emergency) + '</a>' +
            '<div class="lang-picker">' +
              '<button type="button" id="lang-button" class="lang-picker-button" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-menu">' +
                '<span lang="' + esc(t.meta.htmlLang) + '">' + esc(t.meta.nativeName) + '</span><span aria-hidden="true">▾</span>' +
              '</button>' +
              '<div id="lang-menu" class="lang-menu" role="listbox" aria-label="' + esc(t.langLabel) + '" hidden>' +
                I18N.ORDER.map(function (item) {
                  var selected = item.id === language;
                  return '<button type="button" role="option" class="lang-option' + (selected ? ' active' : '') + '" lang="' + esc(item.htmlLang) + '" data-lang="' + esc(item.id) + '" aria-selected="' + selected + '">' + esc(item.nativeName) + '</button>';
                }).join('') +
              '</div>' +
            '</div>' +
            '<button class="menu-button" type="button" aria-label="' + esc(t.menuOpen) + '" aria-expanded="false" aria-controls="mobile-nav">☰</button>' +
          '</div>' +
        '</div>' +
        '<nav class="mobile-nav" id="mobile-nav" aria-label="' + esc(t.navMobile) + '">' + t.nav.map(function (label, i) {
          return '<a href="' + PRIMARY_LINKS[i] + '">' + esc(label) + '</a>';
        }).join('') + '<a href="tel:911">' + esc(t.emergency) + '</a></nav>' +
      '</header>' +
      '<main id="main">' +
        renderConsent(t) +
        '<section class="hero" id="top">' +
          '<div class="shell hero-grid">' +
            '<div class="hero-copy">' +
              '<div class="eyebrow"><span class="dot"></span>' + esc(t.eyebrow) + '</div>' +
              '<h1>' + t.heroTitle + '</h1>' +
              '<p>' + esc(t.heroText) + '</p>' +
              '<div class="hero-buttons">' +
                '<a class="button button-primary" href="#start">' + esc(t.startButton) + ' <span aria-hidden="true">↗</span></a>' +
                '<a class="button button-outline" href="#appointment">' + esc(t.appointmentButton) + '</a>' +
              '</div>' +
              '<div class="hero-note">' + esc(t.heroNote) + '</div>' +
            '</div>' +
            '<div class="hero-visual" aria-hidden="true">' +
              '<div class="orbit"></div><div class="orbit two"></div>' +
              '<div class="route-card">' +
                '<div class="mini-label">' + esc(t.cardLabel) + '</div>' +
                '<div class="route-card-title">' + esc(t.cardTitle) + '</div>' +
                t.cardSteps.map(function (step, i) {
                  return '<div class="route-step"><span class="step-icon">' + ['✳', '◇', '✓'][i] + '</span>' + esc(step) + '<span>0' + (i + 1) + '</span></div>';
                }).join('') +
              '</div>' +
              '<div class="floating-tag">' + esc(t.floatMain) + '<small>' + esc(t.floatSub) + '</small></div>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<div class="quick-strip"><div class="shell">' +
          '<div class="emergency-panel" role="region" aria-label="' + esc(t.emergencyTitle) + '">' +
            '<h2 class="emergency-heading">' + esc(t.emergencyTitle) + '</h2>' +
            '<p>' + esc(t.emergencyLead) + '</p>' +
            '<ul>' + emergencyList + '</ul>' +
            '<p class="emergency-note">' + esc(t.emergencyDisclaimer) + '</p>' +
            '<p class="emergency-links">' + external(OFFICIAL.emergency, t.emergencyOfficial + ' ↗') + ' · ' + external(OFFICIAL.dialNurse, t.emergencyDialNurse + ' ↗') + '</p>' +
          '</div></div></div>' +
        '<section class="section" id="start"><div class="shell">' +
          '<div class="section-kicker">' + esc(t.chooseKicker) + '</div>' +
          '<div class="section-head"><div><h2>' + esc(t.chooseTitle) + '</h2><p class="section-sub">' + esc(t.chooseSub) + '</p></div></div>' +
          '<div class="route-grid">' + t.choices.map(function (choice) {
            return '<a class="choice-card" href="' + hashHref(choice[3]) + '"><span class="choice-icon" aria-hidden="true">' + esc(choice[0]) + '</span><h3>' + esc(choice[1]) + '</h3><p>' + esc(choice[2]) + '</p><span class="choice-arrow" aria-hidden="true">↗</span></a>';
          }).join('') + '</div>' +
          '<div class="decision-panel"><strong>' + esc(t.decisionTitle) + '</strong><p>' + esc(t.decisionText) + '</p><a href="#insurance">' + esc(t.decisionLink) + '</a></div>' +
        '</div></section>' +
        '<section class="section journey-section" id="journey"><div class="shell journey-layout">' +
          '<div class="journey-intro"><div class="section-kicker">' + esc(t.journeyKicker) + '</div><h2>' + esc(t.journeyTitle) + '</h2><p>' + esc(t.journeyText) + '</p>' +
            '<a class="button button-dark" href="#appointment">' + esc(t.journeyButton) + '</a></div>' +
          '<div>' +
            '<div class="path-diagram" role="region" aria-label="' + esc(t.diagramTitle) + '"><h3>' + esc(t.diagramTitle) + '</h3><p class="diagram-alt">' + esc(t.diagramAlt) + '</p><ol>' +
              t.diagramSteps.map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol></div>' +
            '<div class="timeline">' + t.timeline.map(function (step, i) {
              return '<div class="timeline-item"><div class="timeline-num">0' + (i + 1) + '</div><div class="timeline-card"><h3>' + esc(step.title) + '</h3><p>' + esc(step.text) + '</p><div class="detail">' + esc(step.detail) + '</div>' + external(OFFICIAL[step.sourceKey], step.link + ' ↗') + '</div></div>';
            }).join('') + '</div>' +
            sourceLine(t.journeySourceLabel, t.reviewedLabel, t.journeySources, t.journeySourceKeys) +
          '</div></div></section>' +
        '<section class="section" id="insurance"><div class="shell">' +
          '<div class="section-kicker">' + esc(t.compareKicker) + '</div>' +
          '<div class="section-head"><div><h2>' + esc(t.compareTitle) + '</h2><p class="section-sub">' + esc(t.compareSub) + '</p></div></div>' +
          '<div class="compare-grid">' +
            '<article class="compare-card"><div class="compare-top"><span class="compare-icon" aria-hidden="true">✳</span><h3>' + esc(t.feeTitle) + '</h3></div><p>' + esc(t.feeText) + '</p><ul>' +
              t.feeBullets.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>' + external(OFFICIAL.healthFee, t.feeLink) + '</article>' +
            '<article class="compare-card dark"><div class="compare-top"><span class="compare-icon" aria-hidden="true">◇</span><h3>' + esc(t.insuranceTitle) + '</h3></div><p>' + esc(t.insuranceText) + '</p><ul>' +
              t.insuranceBullets.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>' + external(OFFICIAL.insuranceFaq, t.insuranceLink) + '</article>' +
          '</div>' +
          '<div class="insurance-callout">' + t.insuranceCallout + '</div>' +
          '<div class="referral-box"><strong>' + esc(t.referralTitle) + '</strong><p>' + esc(t.referralText) + '</p>' + external(OFFICIAL.referral, t.referralLink) + '</div>' +
          '<div class="referral-box contact-box"><strong>' + esc(t.insuranceContactTitle) + '</strong><ul class="contact-list">' +
            t.insuranceContactItems.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul><p>' + external(OFFICIAL.insuranceContact, t.officePageLink) + '</p></div>' +
          sourceLine(t.insuranceSourceLabel, t.reviewedLabel, t.insuranceSources, t.insuranceSourceKeys) +
        '</div></section>' +
        '<section class="section appointment-section" id="appointment"><div class="shell">' +
          '<div class="section-kicker">' + esc(t.appointmentKicker) + '</div>' +
          '<div class="section-head"><div><h2>' + esc(t.appointmentTitle) + '</h2><p class="section-sub">' + esc(t.appointmentSub) + '</p></div></div>' +
          '<div class="appointment-grid">' +
            '<article class="appointment-card"><div class="number">' + esc(t.onlineNumber) + '</div><h3>' + esc(t.onlineTitle) + '</h3><p>' + esc(t.onlineText) + '</p>' +
              external(OFFICIAL.portal, t.onlineButton, 'button button-dark') + '<div class="helper-row"><span aria-hidden="true">ⓘ</span>' + esc(t.onlineHelp) + '</div></article>' +
            '<article class="appointment-card"><div class="number">' + esc(t.phoneNumber) + '</div><h3>' + esc(t.phoneTitle) + '</h3><p>' + esc(t.phoneText) + '</p>' +
              '<a class="phone-big" href="tel:+12173332700">217-333-2700</a><a class="button button-light" href="tel:+12173332700">' + esc(t.phoneButton) + ' ↗</a>' +
              '<div class="helper-row"><span aria-hidden="true">ⓘ</span>' + esc(t.phoneHelp) + '</div></article>' +
          '</div>' +
          '<div class="cancel-note">' + esc(t.cancelNote) + ' ' + external(OFFICIAL.appointments, t.appointmentsPageLink) + '</div>' +
          '<div class="prompt-box"><div class="prompt-head"><div><h3>' + esc(t.promptTitle) + '</h3><p>' + esc(t.promptSub) + '</p></div>' +
            '<button class="copy-btn" type="button" id="copy-script">' + esc(t.copyButton) + '</button></div>' +
            '<p class="script-text" id="script-text" lang="en">“' + esc(t.promptText) + '”</p>' +
            '<p class="script-meaning">' + esc(t.promptMeaning) + '</p>' +
            '<p class="script-note">' + esc(t.promptSlowLead) + ' <span lang="en">“' + esc(t.promptSlowText) + '”</span></p>' +
            '<p class="script-meaning">' + esc(t.promptSlowMeaning) + '</p></div>' +
          sourceLine(t.appointmentSourceLabel, t.reviewedLabel, t.appointmentSources, t.appointmentSourceKeys) +
        '</div></section>' +
        '<section class="section" id="terms"><div class="shell">' +
          '<div class="section-kicker">' + esc(t.toolsKicker) + '</div>' +
          '<div class="section-head"><div><h2>' + esc(t.toolsTitle) + '</h2><p class="section-sub">' + esc(t.toolsSub) + '</p></div></div>' +
          '<div class="tools-grid">' +
            '<div class="tool-card"><h3>' + esc(t.termsTitle) + '</h3><p>' + esc(t.termsText) + '</p>' +
              '<div class="search-wrap"><span aria-hidden="true">⌕</span><input id="term-search" type="search" autocomplete="off" aria-label="' + esc(t.searchLabel) + '" placeholder="' + esc(t.searchPlaceholder) + '"></div>' +
              '<div class="term-list" id="term-list">' + termsMarkup(t, '') + '</div>' +
              '<p class="check-foot">' + external(OFFICIAL.glossary, t.fullGlossaryLink) + '</p></div>' +
            '<div class="tool-card" id="checklist"><h3>' + esc(t.checklistTitle) + '</h3><p>' + esc(t.checklistText) + '</p>' +
              '<div id="check-progress-label" class="check-foot" aria-live="polite"></div>' +
              '<div class="check-progress" aria-hidden="true"><span id="check-progress-bar"></span></div>' +
              '<div class="check-list">' + t.checklist.map(function (item, i) {
                return '<label class="check-item"><input type="checkbox" data-check="' + i + '"' + (checked.indexOf(i) !== -1 ? ' checked' : '') + '><span>' + esc(item) + '</span></label>';
              }).join('') + '</div>' +
              '<button class="reset-btn" type="button" id="reset-checklist">' + esc(t.checklistReset) + '</button>' +
              '<div class="check-foot">' + esc(t.checklistFoot) + '</div></div>' +
          '</div>' +
          sourceLine(t.toolsSourceLabel, t.reviewedLabel, t.toolsSources, t.toolsSourceKeys) +
        '</div></section>' +
        '<section class="section sources-section" id="sources"><div class="shell">' +
          '<div class="section-kicker">' + esc(t.sourcesKicker) + '</div>' +
          '<div class="section-head"><div><h2>' + esc(t.sourcesTitle) + '</h2><p class="section-sub">' + esc(t.sourcesSub) + '</p></div></div>' +
          '<div class="source-grid">' + t.sources.map(function (source) {
            return '<article class="source-card"><small>' + esc(source[0]) + '</small><h3>' + esc(source[1]) + '</h3><p>' + esc(source[2]) + '</p>' + external(OFFICIAL[source[3]], t.sourceAction) + '</article>';
          }).join('') + '</div>' +
          '<p class="source-note">' + esc(t.sourceNote) + '</p>' +
          '<p class="translation-note">' + esc(t.translationDisclaimer) + '</p>' +
          sourceLine(t.pageSourceLabel, t.reviewedLabel, t.pageSourceText, t.pageSourceKeys) +
        '</div></section>' +
      '</main>' +
      '<footer class="footer"><div class="shell"><div class="footer-grid">' +
        '<div><a class="brand" href="#top"><span class="brand-mark" aria-hidden="true">✳</span>Illinois Care Guide</a><p>' + esc(t.footerText) + '</p><p class="translation-note footer-translation">' + esc(t.translationDisclaimer) + '</p></div>' +
        '<div><h3>' + esc(t.footerNav) + '</h3>' + t.nav.map(function (label, i) {
          return '<a href="' + PRIMARY_LINKS[i] + '">' + esc(label) + '</a>';
        }).join('') + '</div>' +
        '<div><h3>' + esc(t.footerHelp) + '</h3><p>' + esc(t.footerHelpText) + '</p>' +
          '<a href="tel:+12173332700">McKinley · 217-333-2700</a>' +
          '<a href="tel:+12173009000">Student Insurance · 217-300-9000</a>' +
          external(OFFICIAL.insuranceContact, t.footerInsuranceLink, '') +
          external(OFFICIAL.dialNurse, 'Dial-A-Nurse ↗', '') +
          '<button type="button" class="privacy-link" id="privacy-open">' + esc(t.privacyChoices) + '</button></div>' +
      '</div><div class="footer-bottom"><span>' + esc(t.footerBottom) + '</span><span>' + esc(t.footerDate) + '</span></div></div></footer>' +
      renderPrivacyDialog(t);

    document.body.classList.toggle('has-consent', !!document.getElementById('consent-banner'));
    bind();
    updateProgress();
  }

  function updateProgress() {
    var count = document.querySelectorAll('[data-check]:checked').length;
    var label = document.getElementById('check-progress-label');
    var bar = document.getElementById('check-progress-bar');
    if (label) label.textContent = count + ' / ' + t.checklist.length + ' ' + t.checklistProgress;
    if (bar) bar.style.width = (count / t.checklist.length * 100) + '%';
  }

  function acceptConsent() {
    localStorage.setItem(ANALYTICS.CONSENT_KEY, 'granted');
    render();
    maybeStartAnalytics();
  }

  function declineConsent() {
    localStorage.setItem(ANALYTICS.CONSENT_KEY, 'denied');
    var config = ANALYTICS.readConfig(window.ICG_ANALYTICS_CONFIG);
    if (config.measurementId) window[ANALYTICS.disableFlag(config.measurementId)] = true;
    render();
  }

  function revokeConsent() {
    localStorage.setItem(ANALYTICS.CONSENT_KEY, 'denied');
    tagStarted = false;
    ANALYTICS.stopMeasurement(window.ICG_ANALYTICS_CONFIG);
    location.reload();
  }

  function bind() {
    var menuButton = document.querySelector('.menu-button');
    menuButton.addEventListener('click', function () {
      closeLangMenu(false);
      var nav = document.querySelector('.mobile-nav');
      var open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.mobile-nav a'), function (link) {
      link.addEventListener('click', function () {
        document.querySelector('.mobile-nav').classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', t.menuOpen);
      });
    });

    var langButton = document.getElementById('lang-button');
    var langMenu = document.getElementById('lang-menu');
    langButton.addEventListener('click', function () {
      if (langMenu.hidden) openLangMenu('selected');
      else closeLangMenu(false);
    });
    langButton.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLangMenu(event.key === 'ArrowUp' ? 'last' : 'selected');
      }
    });
    Array.prototype.forEach.call(langMenu.querySelectorAll('[role="option"]'), function (option) {
      option.addEventListener('click', function () { setLanguage(option.getAttribute('data-lang')); });
      option.addEventListener('keydown', function (event) {
        var options = Array.prototype.slice.call(langMenu.querySelectorAll('[role="option"]'));
        var index = options.indexOf(option);
        if (event.key === 'ArrowDown') { event.preventDefault(); options[(index + 1) % options.length].focus(); }
        if (event.key === 'ArrowUp') { event.preventDefault(); options[(index - 1 + options.length) % options.length].focus(); }
        if (event.key === 'Home') { event.preventDefault(); options[0].focus(); }
        if (event.key === 'End') { event.preventDefault(); options[options.length - 1].focus(); }
        if (event.key === 'Escape') { event.preventDefault(); closeLangMenu(true); }
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setLanguage(option.getAttribute('data-lang')); }
      });
    });

    document.getElementById('term-search').addEventListener('input', function (event) {
      document.getElementById('term-list').innerHTML = termsMarkup(t, event.target.value);
    });

    document.getElementById('copy-script').addEventListener('click', function (event) {
      var button = event.currentTarget;
      var done = function () {
        button.textContent = t.copied;
        setTimeout(function () { if (button.isConnected) button.textContent = t.copyButton; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t.promptText).then(done).catch(function () {
          var range = document.createRange();
          range.selectNodeContents(document.getElementById('script-text'));
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        });
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-check]'), function (input) {
      input.addEventListener('change', function () { saveChecks(); updateProgress(); });
    });
    document.getElementById('reset-checklist').addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-check]'), function (input) { input.checked = false; });
      saveChecks();
      updateProgress();
    });

    var accept = document.getElementById('consent-accept');
    var decline = document.getElementById('consent-decline');
    var details = document.getElementById('consent-details');
    var dismiss = document.getElementById('signal-dismiss');
    if (accept) accept.addEventListener('click', acceptConsent);
    if (decline) decline.addEventListener('click', declineConsent);
    if (details) details.addEventListener('click', function () { dialog.showModal(); });
    if (dismiss) dismiss.addEventListener('click', function () {
      localStorage.setItem(ANALYTICS.SIGNAL_DISMISS_KEY, '1');
      render();
    });

    var dialog = document.getElementById('privacy-dialog');
    document.getElementById('privacy-open').addEventListener('click', function () { dialog.showModal(); });
    document.getElementById('privacy-close').addEventListener('click', function () { dialog.close(); });
    var privacyAccept = document.getElementById('privacy-accept');
    var privacyDecline = document.getElementById('privacy-decline');
    var privacyRevoke = document.getElementById('privacy-revoke');
    if (privacyAccept) privacyAccept.addEventListener('click', acceptConsent);
    if (privacyDecline) privacyDecline.addEventListener('click', declineConsent);
    if (privacyRevoke) privacyRevoke.addEventListener('click', revokeConsent);
  }

  document.addEventListener('click', function (event) {
    var picker = document.querySelector('.lang-picker');
    if (picker && !picker.contains(event.target)) closeLangMenu(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      var menu = document.getElementById('lang-menu');
      if (menu && !menu.hidden) closeLangMenu(true);
    }
  });

  ANALYTICS.installNetworkGuard();
  render();
  maybeStartAnalytics();
})();
