'use client';
import { useEffect, useState } from 'react';

export default function OfflineSupport() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update); update();
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  return <span className="offline-status" role="status" aria-live="polite" data-offline={offline}>{offline ? 'Offline · saved pages may still be available' : 'Offline-ready shell'}</span>;
}
