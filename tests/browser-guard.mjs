export const GA_URL = /google-analytics|googletagmanager|doubleclick|googleadservices|googlesyndication|analytics\.google/;

export function trackConsole(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

export async function shieldGoogle(page, bucket) {
  await page.route(GA_URL, (route) => {
    bucket.push({ url: route.request().url(), method: route.request().method() });
    return route.fulfill({ status: 204, body: '' });
  });
}

export const PROMPT = 'Hello, I’m a UIUC student. I would like to make an appointment for a non-emergency health concern. Could you tell me the next available time and what I should bring?';
