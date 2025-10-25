"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import Navbar from './Navbar'
import Preloader from './Preloader'
import { HeroSection } from './HeroSection'
import WishesSection from './WishesSection'
import EditSection from './EditSection'
import AudioControl from './AudioControl'
import { pageSwing, pageEntrance } from '../animations/pageAnimations'
import { useBackgroundAudio } from '../hooks/useBackgroundAudio'

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [pageAnimationStarted, setPageAnimationStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Background audio
  const { isMuted, hasUserInteracted, toggleMute, pauseTemporarily, resumeAudio } = useBackgroundAudio();

  const handlePreloaderComplete = () => {
    setPageAnimationStarted(true);
    setTimeout(() => setShowPreloader(false), 1200); // Hide preloader after animation
  };

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Check for mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      console.log('Mobile check:', mobile, 'Width:', window.innerWidth);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Scroll to top on load
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} isExiting={pageAnimationStarted} />}

      {/* Audio Control Button */}
      <AudioControl
        isMuted={isMuted}
        onToggleMute={toggleMute}
        hasUserInteracted={hasUserInteracted}
      />

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
        <Navbar onMenuToggle={setIsMenuOpen} pageAnimationStarted={pageAnimationStarted} />

        <motion.div
          variants={pageSwing}
          animate="animate"
          custom={isMenuOpen}
          style={{
            width: '100%'
          }}
        >
          <HeroSection pageAnimationStarted={pageAnimationStarted} />

          <WishesSection
            onPauseBackgroundAudio={pauseTemporarily}
            onResumeBackgroundAudio={resumeAudio}
          />

          <EditSection />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage
