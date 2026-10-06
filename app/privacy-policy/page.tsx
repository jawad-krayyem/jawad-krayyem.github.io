import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';

export default function PrivacyPolicyPage() {
  const policy = readFileSync(join(process.cwd(), 'content', 'privacy-policy.txt'), 'utf8');
  return <div className="site-shell"><SiteChrome /><main id="main">
    <div className="page-intro"><div className="eyebrow">Policy archive / public document</div><h1>Privacy<br />policy.</h1><p>The policy text below is reproduced as supplied.</p></div>
    <section className="privacy-wrap"><p className="privacy-note">Source text · FRACTURE Privacy Policy</p><div className="policy-paper"><pre>{policy}</pre></div></section>
  </main><SiteFooter /></div>;
}
