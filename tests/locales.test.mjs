import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

function load(relativePaths) {
  const context = {};
  vm.createContext(context);
  for (const relativePath of relativePaths) {
    vm.runInContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), context);
  }
  return context;
}

const context = load([
  'official.js',
  'i18n.js',
  'locales/en.js',
  'locales/zh-Hans.js',
  'locales/zh-Hant.js',
  'locales/ko.js',
  'locales/hi.js'
]);

const locales = context.ICG_LOCALES;
const order = context.ICGI18n.ORDER.map((item) => item.id);
const officialKeys = Object.keys(context.ICGOfficial).sort();

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = shape(value[key]);
      return acc;
    }, {});
  }
  return typeof value;
}

function walk(value, trail, visit) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${trail}[${index}]`, visit));
    return;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => walk(value[key], `${trail}.${key}`, visit));
    return;
  }
  visit(value, trail);
}

const PHONES = ['911', '988', '815-720-4953', '217-333-2700', '217-300-9000', '217-333-0165'];
const ANCHORS = [
  'insure@illinois.edu',
  '611 W. Park St., Urbana, IL 61801',
  '1400 W. Park St., Urbana, IL 61801',
  'Carle Foundation Hospital',
  'OSF HealthCare Heart of Mary Medical Center',
  '$20',
  '$15',
  '$600',
  '$250',
  '$100',
  '20%',
  'MyMcKinley',
  'Billing Statement',
  'Health Service Fee',
  'Student Health Insurance',
  'Dial-A-Nurse',
  'in-network',
  'NetID'
];

test('locale set is exactly the five supported languages', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(Object.keys(locales).sort())), ['en', 'hi', 'ko', 'zh-Hans', 'zh-Hant']);
  assert.deepEqual(JSON.parse(JSON.stringify(order)), ['en', 'zh-Hans', 'zh-Hant', 'ko', 'hi']);
});

test('locale keys and array shapes match English', () => {
  const englishShape = JSON.stringify(shape(locales.en));
  for (const id of order) {
    assert.equal(JSON.stringify(shape(locales[id])), englishShape, id);
  }
});

test('strings are filled in and do not leak objects or flags', () => {
  const flag = /\p{Regional_Indicator}/u;
  for (const id of order) {
    walk(locales[id], id, (value, trail) => {
      assert.equal(typeof value, 'string', trail);
      if (!trail.endsWith('.example')) assert.notEqual(value.trim(), '', trail);
      assert.equal(value.includes('undefined'), false, trail);
      assert.equal(value.includes('[object Object]'), false, trail);
      assert.equal(flag.test(value), false, trail);
      assert.equal(/Rohan|course project/i.test(value), false, trail);
    });
  }
});

test('locale files do not embed official URLs', () => {
  for (const file of ['locales/en.js', 'locales/zh-Hans.js', 'locales/zh-Hant.js', 'locales/ko.js', 'locales/hi.js']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal(/https?:\/\//.test(source), false, file);
  }
});

test('source keys, glossary questions, and phone scripts stay aligned', () => {
  const english = locales.en;
  for (const id of order) {
    const locale = locales[id];
    assert.equal(locale.meta.id, id);
    assert.equal(locale.meta.htmlLang, id);
    assert.deepEqual(locale.journeySourceKeys, english.journeySourceKeys);
    assert.deepEqual(locale.insuranceSourceKeys, english.insuranceSourceKeys);
    assert.deepEqual(locale.appointmentSourceKeys, english.appointmentSourceKeys);
    assert.deepEqual(locale.toolsSourceKeys, english.toolsSourceKeys);
    assert.deepEqual(locale.pageSourceKeys, english.pageSourceKeys);
    assert.deepEqual(Object.keys(locale.linkLabels).sort(), officialKeys);
    locale.timeline.forEach((step, index) => {
      assert.equal(step.sourceKey, english.timeline[index].sourceKey);
    });
    locale.sources.forEach((source, index) => {
      assert.equal(source[3], english.sources[index][3]);
      assert.equal(context.ICGOfficial[source[3]]?.startsWith('https://'), true);
    });
    locale.choices.forEach((choice, index) => {
      assert.equal(choice[0], english.choices[index][0]);
      assert.equal(choice[3], english.choices[index][3]);
    });
    assert.equal(locale.terms.length, 6);
    assert.equal(locale.checklist.length, 6);
    locale.terms.forEach((term, index) => {
      assert.equal(term.word, english.terms[index].word);
      assert.equal(term.question, english.terms[index].question);
    });
    assert.equal(locale.promptText, english.promptText);
    assert.equal(locale.promptSlowText, english.promptSlowText);
  }
});

test('every locale keeps emergency numbers, addresses, and fee facts', () => {
  const facts = {
    en: ['two hours', '8:00 a.m.–4:30 p.m.', '8:00 a.m.–5:00 p.m.', 'does not accept health insurance', 'Does not pay for care outside McKinley', 'official English', 'native-speaker clinical review', 'not medical advice'],
    'zh-Hans': ['2 小时', '8:00–16:30', '8:00–17:00', '不接受健康保险', '不能支付 McKinley 之外', '官方英文', '临床复核', '不是医疗建议', '转诊'],
    'zh-Hant': ['2 小時', '8:00–16:30', '8:00–17:00', '不接受健康保險', '不能支付 McKinley 以外', '官方英文', '臨床複核', '不是醫療建議', '轉診', '資訊', '預約', '網路', '自負額'],
    ko: ['2시간', '8:00–16:30', '8:00–17:00', '건강 보험을 받지 않으며', 'McKinley 밖의 진료비는 지급하지 않습니다', '공식 영어', '원어민 임상 검토', '의학적 조언이 아닙니다', '진료의뢰'],
    hi: ['2 घंटे', '8:00–16:30', '8:00–17:00', 'स्वास्थ्य बीमा स्वीकार नहीं करता', 'McKinley के बाहर की देखभाल', 'आधिकारिक अंग्रेज़ी', 'मूलभाषी चिकित्सक', 'चिकित्सकीय सलाह नहीं', 'रेफरल']
  };
  for (const id of order) {
    const blob = JSON.stringify(locales[id]);
    for (const needle of [...PHONES, ...ANCHORS, ...facts[id]]) {
      assert.equal(blob.includes(needle), true, `${id} missing ${needle}`);
    }
  }
  assert.equal(locales['zh-Hant'].meta.nativeName, '繁體中文');
  assert.equal(JSON.stringify(locales['zh-Hans']).includes('预约'), true);
  assert.equal(JSON.stringify(locales['zh-Hans']).includes('转诊'), true);
  assert.equal(JSON.stringify(locales['zh-Hant']).includes('预约'), false);
  assert.equal(JSON.stringify(locales['zh-Hant']).includes('信息'), false);
  assert.equal(/\p{Script=Hangul}/u.test(JSON.stringify(locales.ko)), true);
  assert.equal(/\p{Script=Devanagari}/u.test(JSON.stringify(locales.hi)), true);
});

test('stored language migrates and browser matching does not infer a country', () => {
  const i18n = context.ICGI18n;
  assert.deepEqual(JSON.parse(JSON.stringify(i18n.resolveLanguage('zh', ['en-US']))), { lang: 'zh-Hans', explicit: true, migratedFrom: 'zh' });
  assert.deepEqual(JSON.parse(JSON.stringify(i18n.resolveLanguage('en', ['ko-KR', 'hi-IN']))), { lang: 'en', explicit: true, migratedFrom: '' });
  assert.equal(i18n.resolveLanguage(null, ['ko-KR', 'en']).lang, 'ko');
  assert.equal(i18n.resolveLanguage('', ['zh-TW', 'zh', 'en']).lang, 'zh-Hant');
  assert.equal(i18n.resolveLanguage(null, ['zh-HK']).lang, 'zh-Hant');
  assert.equal(i18n.resolveLanguage(null, ['hi-IN', 'en']).lang, 'hi');
  assert.equal(i18n.resolveLanguage(null, ['en-IN', 'en']).lang, 'en');
  assert.equal(i18n.resolveLanguage(null, ['bn-BD']).lang, 'en');
  assert.equal(i18n.resolveLanguage(null, []).lang, 'en');
  assert.equal(i18n.normalizeStored('zh-CN'), 'zh-Hans');
});
