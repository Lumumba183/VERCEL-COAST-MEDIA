'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fires a page-view beacon on every route change and a heartbeat every
 * 30s while the tab is open. The visitor id is an anonymous random value
 * kept in localStorage — no cookies, nothing personal.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const vidRef = useRef<string>('');

  useEffect(() => {
    let vid = localStorage.getItem('cm_vid') || '';
    if (!vid) {
      vid = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).replace(/-/g, '');
      localStorage.setItem('cm_vid', vid);
    }
    vidRef.current = vid;
  }, []);

  // Page view on route change
  useEffect(() => {
    if (!vidRef.current || pathname.startsWith('/admin')) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid: vidRef.current, path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  // Heartbeat every 30s
  useEffect(() => {
    const t = setInterval(() => {
      if (!vidRef.current || document.hidden) return;
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vid: vidRef.current, path: window.location.pathname, hb: true }),
        keepalive: true,
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return null;
}
