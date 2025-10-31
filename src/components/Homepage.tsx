"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import Navbar from './Navbar'
import Preloader from './Preloader'
import { HeroSection } from './HeroSection'
import WishesSection from './WishesSection'
import EditSection from './EditSection'
import AboutSection from './AboutSection'
import { pageSwing, pageEntrance } from '../animations/pageAnimations'
import { useAudioContext } from '../providers/AudioProvider'
import { useMediaQuery } from '../hooks/useMediaQuery'

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [pageAnimationStarted, setPageAnimationStarted] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('50% 50vh');
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Background audio from global context
  const { pauseTemporarily, resumeAudio } = useAudioContext();

  const handlePreloaderComplete = () => {
    setPageAnimationStarted(true);
    setTimeout(() => setShowPreloader(false), 1200); // Hide preloader after animation
  };

  // Prevent scrolling during preloader
  useEffect(() => {
    if (!showPreloader) {
      // Remove loading class when preloader is done
      document.body.classList.remove('loading');
    }
  }, [showPreloader]);

  const handleMenuToggle = (menuState: boolean) => {
    if (menuState) {
      // Capture current viewport center in page coordinates
      const scrollY = window.scrollY;
      const viewportCenterY = scrollY + (window.innerHeight / 2);
      setTransformOrigin(`50% ${viewportCenterY}px`);
    }
    setIsMenuOpen(menuState);
  };

  useEffect(() => {
    // Only initialize Lenis after preloader is done
    if (!showPreloader) {
      const lenis = new Lenis();

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }

    // Scroll to top on load
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {};
  }, [showPreloader]);

  return (
    <div style={{ position: 'relative' }}>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} isExiting={pageAnimationStarted} />}


      <motion.div
        variants={pageEntrance}
        initial="initial"
        animate={pageAnimationStarted ? "animate" : "initial"}
        custom={isMobile}
        style={{
          position: 'relative',
          backgroundColor: 'transparent',
          zIndex: pageAnimationStarted ? 10000 : 1,
          transformOrigin: 'top left'
        }}
      >
        <Navbar onMenuToggle={handleMenuToggle} pageAnimationStarted={pageAnimationStarted} />

        <motion.div
          variants={pageSwing}
          animate="animate"
          custom={isMenuOpen}
          style={{
            width: '100%',
            transformOrigin: transformOrigin
          }}
        >
          <HeroSection pageAnimationStarted={pageAnimationStarted} />

          <WishesSection />

          <EditSection />

          <AboutSection />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage
