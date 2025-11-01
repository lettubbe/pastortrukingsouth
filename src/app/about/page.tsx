"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import Navbar from '../../components/Navbar'
import AboutSection from '../../components/AboutSection'
import Preloader from '../../components/Preloader'
import { pageSwing, pageEntrance } from '../../animations/pageAnimations'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const AboutPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [pageAnimationStarted, setPageAnimationStarted] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('50% 50vh');
  const isMobile = useMediaQuery('(max-width: 1024px)');

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
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} isExiting={pageAnimationStarted} text="About" />}

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
        <Navbar onMenuToggle={handleMenuToggle} pageAnimationStarted={pageAnimationStarted} forceBlackText={true} />

        <motion.div
          variants={pageSwing}
          animate="animate"
          custom={isMenuOpen}
          style={{
            width: '100%',
            transformOrigin: transformOrigin
          }}
        >
          {/* Use the existing AboutSection component */}
          <div style={{marginTop: '80vh'}}>
            <AboutSection />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AboutPage