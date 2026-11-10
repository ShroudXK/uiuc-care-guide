import { expect, test } from '@playwright/test';
import { shieldGoogle, trackConsole } from './browser-guard.mjs';

const LOCALES = [
  { id: 'en', name: 'English', term: 'referral' },
  { id: 'zh-Hans', name: '简体中文', term: '转诊' },
  { id: 'zh-Hant', name: '繁體中文', term: '轉診' },
  { id: 'ko', name: '한국어', term: '진료의뢰' },
  { id: 'hi', name: 'हिन्दी', term: 'रेफरल' }
];

async function openLocale(page, id) {
  const hits = [];
  const errors = trackConsole(page);
  await shieldGoogle(page, hits);
  await page.addInitScript((language) => {
    localStorage.setItem('icg-language', language);
  }, id);
  await page.goto('/');
  await page.locator('#lang-button').waitFor();
  return { hits, errors };
}

for (const locale of LOCALES) {
  test(`${locale.id} renders navigation, search, and glossary`, async ({ page }, testInfo) => {
    const { hits, errors } = await openLocale(page, locale.id);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.id);
    await expect(page.locator('#lang-button')).toContainText(locale.name);
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('[object Object]');
    await expect(page.locator('.emergency-panel a[href="tel:911"]')).toBeVisible();
    await expect(page.locator('a[href="tel:988"]')).toHaveCount(1);
    await expect(page.locator('a[href="tel:+12173332700"]').first()).toBeVisible();
    await expect(page.locator('#script-text')).toContainText('Hello, I’m a UIUC student');
    await page.locator('#term-search').fill('copay');
    await expect(page.locator('#term-list')).toContainText('Copay');
    await page.locator('#term-search').fill(locale.term);
    await expect(page.locator('#term-list')).toContainText(locale.term);
    await page.locator('[data-check="0"]').check();
    await page.locator('#term-search').fill('deductible');
    await expect(page.locator('[data-check="0"]')).toBeChecked();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('icg-checklist'))).toBe('[0]');

    if (testInfo.project.name === 'mobile') {
      await page.locator('.menu-button').click();
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await page.locator('#mobile-nav a').first().click();
      await expect(page.locator('#mobile-nav')).toBeHidden();
    } else {
      await page.locator('#lang-button').focus();
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('#lang-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#lang-menu')).toBeHidden();
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const allowed = await page.evaluate(() => Object.values(window.ICGOfficial));
    const permitted = new Set([
      ...allowed,
      'tel:911',
      'tel:988',
      'tel:+18157204953',
      'tel:+12173332700',
      'tel:+12173009000',
      'tel:+12173330165',
      'mailto:insure@illinois.edu'
    ]);
    for (const href of hrefs) {
      if (href.startsWith('#')) continue;
      expect(permitted.has(href), href).toBeTruthy();
    }
    expect(hits).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('language choice persists and does not reset the checklist', async ({ page }) => {
  const errors = trackConsole(page);
  await shieldGoogle(page, []);
  await page.addInitScript(() => {
    if (sessionStorage.getItem('icg-seeded') === '1') return;
    localStorage.setItem('icg-language', 'en');
    localStorage.setItem('icg-checklist', '[0,2]');
    sessionStorage.setItem('icg-seeded', '1');
  });
  await page.goto('/');
  await expect(page.locator('[data-check="0"]')).toBeChecked();
  await expect(page.locator('[data-check="2"]')).toBeChecked();
  await page.locator('#lang-button').click();
  await page.locator('[data-lang="ko"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('[data-check="0"]')).toBeChecked();
  await expect(page.locator('[data-check="1"]')).not.toBeChecked();
  await expect(page.locator('[data-check="2"]')).toBeChecked();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('icg-checklist'))).toBe('[0,2]');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('[data-check="2"]')).toBeChecked();
  expect(errors).toEqual([]);
});

test('legacy zh storage migrates to Simplified Chinese', async ({ page }) => {
  await shieldGoogle(page, []);
  await page.addInitScript(() => {
    localStorage.setItem('icg-language', 'zh');
    localStorage.setItem('icg-checklist', '[1]');
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  await expect(page.locator('#lang-button')).toContainText('简体中文');
  await expect(page.locator('[data-check="1"]')).toBeChecked();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('icg-language'))).toBe('zh-Hans');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('icg-checklist'))).toBe('[1]');
});

test('browser language is used until the visitor chooses, without treating India as Hindi', async ({ page }) => {
  await shieldGoogle(page, []);
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'languages', { configurable: true, get: () => ['en-IN', 'en'] });
    Object.defineProperty(Navigator.prototype, 'language', { configurable: true, get: () => 'en-IN' });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.evaluate(() => localStorage.clear());
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'languages', { configurable: true, get: () => ['ko-KR', 'en-US'] });
    Object.defineProperty(Navigator.prototype, 'language', { configurable: true, get: () => 'ko-KR' });
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await page.evaluate(() => localStorage.setItem('icg-language', 'en'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
