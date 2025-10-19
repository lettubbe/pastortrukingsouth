import { useState, useEffect, RefObject } from 'react';

export const useScrollProgress = (heroRef: RefObject<HTMLDivElement>) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
      if (!scrollContainer || !heroRef.current) return;

      const scrollTop = scrollContainer.scrollTop;
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.min(Math.max(scrollTop / (heroHeight - window.innerHeight), 0), 1);
      
      setScrollProgress(progress);
      console.log('Scroll progress:', progress, 'scrollTop:', scrollTop); // Debug log
    };

    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [heroRef]);

  return scrollProgress;
};