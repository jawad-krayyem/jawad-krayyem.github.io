import type { SVGProps } from 'react';
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: 'arrow' | 'external' | 'menu' | 'close' | 'sun' | 'moon' | 'search' | 'copy' | 'download' | 'check' | 'mail' | 'code' | 'play' }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>, external: <><path d="M14 4h6v6M20 4l-9 9M10 5H5v14h14v-5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>, close: <path d="m6 6 12 12M18 6 6 18" />,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1"/></>, moon: <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>, copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 5V3H3v12h2"/></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>, check: <path d="m5 12 4 4L19 6"/>, mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>, code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/></>, play: <path d="m8 4 12 8-12 8Z"/>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
