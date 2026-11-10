(function (root) {
  var SUPPORTED = ['en', 'zh-Hans', 'zh-Hant', 'ko', 'hi'];
  var ORDER = [
    { id: 'en', htmlLang: 'en', nativeName: 'English' },
    { id: 'zh-Hans', htmlLang: 'zh-Hans', nativeName: '简体中文' },
    { id: 'zh-Hant', htmlLang: 'zh-Hant', nativeName: '繁體中文' },
    { id: 'ko', htmlLang: 'ko', nativeName: '한국어' },
    { id: 'hi', htmlLang: 'hi', nativeName: 'हिन्दी' }
  ];
  var LEGACY = {
    zh: 'zh-Hans',
    'zh-cn': 'zh-Hans',
    'zh-hans': 'zh-Hans',
    'zh-sg': 'zh-Hans',
    'zh-tw': 'zh-Hant',
    'zh-hk': 'zh-Hant',
    'zh-mo': 'zh-Hant',
    'zh-hant': 'zh-Hant',
    'ko-kr': 'ko',
    kr: 'ko',
    'hi-in': 'hi',
    en: 'en',
    'zh-hans-cn': 'zh-Hans'
  };

  function normalizeStored(value) {
    if (typeof value !== 'string') return '';
    var trimmed = value.trim();
    if (!trimmed) return '';
    if (SUPPORTED.indexOf(trimmed) !== -1) return trimmed;
    var lower = trimmed.toLowerCase();
    if (SUPPORTED.indexOf(lower) !== -1) return lower;
    return LEGACY[lower] || '';
  }

  function matchBrowserLanguage(languages) {
    var list = Array.isArray(languages) ? languages : (languages ? [languages] : []);
    var i;
    for (i = 0; i < list.length; i += 1) {
      var tag = list[i];
      if (!tag) continue;
      var l = String(tag).toLowerCase().replace(/_/g, '-');
      if (
        l === 'zh-hant' || l.indexOf('zh-hant-') === 0 ||
        l === 'zh-tw' || l.indexOf('zh-tw-') === 0 ||
        l === 'zh-hk' || l.indexOf('zh-hk-') === 0 ||
        l === 'zh-mo' || l.indexOf('zh-mo-') === 0
      ) return 'zh-Hant';
      if (
        l === 'zh' || l === 'zh-hans' || l.indexOf('zh-hans-') === 0 ||
        l === 'zh-cn' || l.indexOf('zh-cn-') === 0 ||
        l === 'zh-sg' || l.indexOf('zh-sg-') === 0 ||
        l.indexOf('zh-') === 0
      ) return 'zh-Hans';
      if (l === 'ko' || l.indexOf('ko-') === 0) return 'ko';
      if (l === 'hi' || l.indexOf('hi-') === 0) return 'hi';
      if (l === 'en' || l.indexOf('en-') === 0) return 'en';
    }
    return 'en';
  }

  function resolveLanguage(stored, languages) {
    var explicit = normalizeStored(stored);
    if (explicit) return { lang: explicit, explicit: true, migratedFrom: stored && stored !== explicit ? stored : '' };
    return { lang: matchBrowserLanguage(languages), explicit: false, migratedFrom: '' };
  }

  root.ICGI18n = {
    SUPPORTED: SUPPORTED,
    ORDER: ORDER,
    LANGUAGE_KEY: 'icg-language',
    CHECKLIST_KEY: 'icg-checklist',
    normalizeStored: normalizeStored,
    matchBrowserLanguage: matchBrowserLanguage,
    resolveLanguage: resolveLanguage
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
