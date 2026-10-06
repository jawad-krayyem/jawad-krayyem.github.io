'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import {
  applyConsent, configureAnalytics, CONSENT_KEY, MEASUREMENT_ID,
  PREFERENCES_EVENT, readConsent, rememberConsent,
} from '../lib/analytics-consent';
import type { AnalyticsChoice } from '../lib/analytics-consent';

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [open, setOpen] = useState(false);
  const rejectButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const restore = () => {
      const saved = readConsent();
      applyConsent(saved);
      setChoice(saved);
      setOpen(saved === null);
    };
    restore();
    const showPreferences = (event: Event) => {
      returnFocus.current = (event as CustomEvent<HTMLElement>).detail;
      setOpen(true);
    };
    const syncPreferences = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) restore();
    };
    window.addEventListener(PREFERENCES_EVENT, showPreferences);
    window.addEventListener('storage', syncPreferences);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, showPreferences);
      window.removeEventListener('storage', syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (open && returnFocus.current) rejectButton.current?.focus();
  }, [open]);

  function choose(nextChoice: AnalyticsChoice) {
    applyConsent(nextChoice);
    rememberConsent(nextChoice);
    setChoice(nextChoice);
    setOpen(false);
    returnFocus.current?.focus();
    returnFocus.current = null;
  }

  return <>
    {choice === 'accepted' && <Script
      id="google-analytics-loader"
      src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      strategy="afterInteractive"
      onReady={configureAnalytics}
    />}
    {open && <section
      className="consent-banner"
      role="dialog"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
    >
      <div className="consent-copy">
        <h2 id="analytics-consent-title">Your analytics choice</h2>
        <p id="analytics-consent-description">We use Google Analytics to understand how visitors use this website. Analytics stays off until you accept. You can change your choice using Privacy settings in the footer.</p>
        <Link href="/privacy-policy/#website-analytics">Read about website analytics ↗</Link>
      </div>
      <div className="consent-actions">
        <button ref={rejectButton} type="button" onClick={() => choose('rejected')}>Reject analytics</button>
        <button type="button" onClick={() => choose('accepted')}>Accept analytics</button>
      </div>
    </section>}
  </>;
}

export function PrivacySettingsButton() {
  return <button className="footer-link-button" type="button" aria-haspopup="dialog"
    onClick={event => window.dispatchEvent(new CustomEvent(PREFERENCES_EVENT, { detail: event.currentTarget }))}
  >Privacy settings</button>;
}
