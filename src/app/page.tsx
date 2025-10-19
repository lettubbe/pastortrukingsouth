'use client';
import { useEffect } from 'react';
import Homepage from './components/Homepage';

export default function Home() {
  useEffect(() => {
    // Ensure page starts at top
    window.scrollTo(0, 0);
  }, []);

  return <Homepage />;
}
