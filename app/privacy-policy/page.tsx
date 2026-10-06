import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';

export default function PrivacyPolicyPage() {
  const policy = readFileSync(join(process.cwd(), 'content', 'privacy-policy.txt'), 'utf8');
  return <div className="site-shell"><SiteChrome /><main id="main">
    <div className="page-intro"><div className="eyebrow">Policy archive / public document</div><h1>Privacy<br />policy.</h1><p>The policy text below is reproduced as supplied.</p></div>
    <section className="privacy-wrap">
      <section className="analytics-notice" id="website-analytics" aria-labelledby="website-analytics-title">
        <h2 id="website-analytics-title">Website analytics</h2>
        <p>This portfolio uses Google Analytics only after you choose Accept analytics. It helps us understand page visits and how people use the site. When enabled, it can use analytics cookies and send information such as the page URL, browser and device details, and interactions to Google.</p>
        <p>You can reject analytics and continue using the website. To change or withdraw your choice, use Privacy settings in the footer. Rejecting disables further Google Analytics collection and removes this site's accessible Google Analytics cookies.</p>
        <p>Your choice is saved in your browser's local storage for up to 180 days. If storage is unavailable, your choice applies to the current page and you will be asked again on your next visit.</p>
        <p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from sites that use its services ↗</a></p>
      </section>
      <p className="privacy-note">Source text · FRACTURE Privacy Policy</p><div className="policy-paper"><pre>{policy}</pre></div>
    </section>
  </main><SiteFooter /></div>;
}
