'use client';
import { useEffect } from 'react';
import Homepage from '../components/Homepage';

export default function Home() {
  useEffect(() => {
    // Ensure page starts at top on mount and reload
    window.scrollTo(0, 0);

    // Also handle browser back/forward navigation
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    // scroll restoration to manual to prevent browser from restoring scroll position
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return <Homepage />;
}
