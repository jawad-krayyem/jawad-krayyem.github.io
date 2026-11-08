'use client';
import { useEffect, useState } from 'react';
export default function SiteLoader() {
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    let cancelled = false;
    document.documentElement.dataset.loading = 'true';
    const done = () => { if (!cancelled) { setFinished(true); delete document.documentElement.dataset.loading; } };
    const timer = window.setTimeout(done, 1400);
    document.fonts.ready.then(done).catch(done);
    return () => { cancelled = true; clearTimeout(timer); delete document.documentElement.dataset.loading; };
  }, []);
  return <><div className={`site-loader ${finished ? 'loader-finished' : ''}`} aria-hidden="true"><span className="loader-monogram">jk<span>.</span></span><span className="loader-label">Jawad Krayyem / Portfolio</span><span className="loader-line"/></div><noscript><style>{'.site-loader{display:none!important}'}</style></noscript></>;
}
