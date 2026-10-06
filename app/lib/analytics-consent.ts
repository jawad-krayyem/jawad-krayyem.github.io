export const MEASUREMENT_ID = 'G-ZZ44GL8H6H';
export const CONSENT_KEY = 'jk-analytics-consent-v1';
export const PREFERENCES_EVENT = 'jk:analytics-preferences';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export type AnalyticsChoice = 'accepted' | 'rejected';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  'ga-disable-G-ZZ44GL8H6H'?: boolean;
};

const denied = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};
let initialized = false;
let configured = false;

export function readConsent(): AnalyticsChoice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    const age = Date.now() - saved?.savedAt;
    if (
      (saved?.choice === 'accepted' || saved?.choice === 'rejected') &&
      typeof saved.savedAt === 'number' && age >= 0 && age < CONSENT_MAX_AGE
    ) {
      return saved.choice;
    }
  } catch {
    // If browser storage is unavailable, ask again on the next visit.
  }
  return null;
}

export function rememberConsent(choice: AnalyticsChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, savedAt: Date.now() }));
  } catch {
    // The visitor's choice still applies to the current page.
  }
}

function clearAnalyticsCookies() {
  const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0])
    .filter(name => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name));
  const domains = ['', location.hostname, `.${location.hostname}`];
  const labels = location.hostname.split('.');
  for (let index = 1; index < labels.length - 1; index++) {
    domains.push(`.${labels.slice(index).join('.')}`);
  }
  const paths = new Set(['/']);
  const segments = location.pathname.split('/').filter(Boolean);
  for (let index = 1; index <= segments.length; index++) {
    const path = `/${segments.slice(0, index).join('/')}`;
    paths.add(path);
    paths.add(`${path}/`);
  }
  for (const name of names) {
    for (const domain of domains) {
      for (const path of paths) {
        document.cookie = `${name}=; Max-Age=0; Path=${path}${domain ? `; Domain=${domain}` : ''}`;
      }
    }
  }
}

export function applyConsent(choice: AnalyticsChoice | null) {
  const browser = window as AnalyticsWindow;
  browser.dataLayer ||= [];
  browser.gtag ||= function () { browser.dataLayer!.push(arguments); };
  if (!initialized) {
    browser['ga-disable-G-ZZ44GL8H6H'] = true;
    browser.gtag('consent', 'default', denied);
    initialized = true;
  }

  const accepted = choice === 'accepted';
  const wasDisabled = browser['ga-disable-G-ZZ44GL8H6H'];
  browser['ga-disable-G-ZZ44GL8H6H'] = !accepted;
  browser.gtag('consent', 'update', {
    ...denied,
    analytics_storage: accepted ? 'granted' : 'denied',
  });
  if (!accepted) {
    clearAnalyticsCookies();
  } else if (configured && wasDisabled) {
    // Record the current page once when a visitor opts back in.
    browser.gtag('event', 'page_view', {
      page_location: location.href,
      page_title: document.title,
    });
  }
}

export function configureAnalytics() {
  const browser = window as AnalyticsWindow;
  if (configured || browser['ga-disable-G-ZZ44GL8H6H'] !== false) return;
  browser.gtag?.('js', new Date());
  browser.gtag?.('config', MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  configured = true;
}
