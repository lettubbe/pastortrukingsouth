"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import AboutSection from '../../components/AboutSection'
import Preloader from '../../components/Preloader'
import { pageSwing, pageEntrance } from '../../animations/pageAnimations'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const AboutPage = () => {
  // Preloader and page animation state
  const [showPreloader, setShowPreloader] = useState(true)
  const [pageAnimationStarted, setPageAnimationStarted] = useState(false)
  const [transformOrigin, setTransformOrigin] = useState('50% 50vh')
  const isMobile = useMediaQuery('(max-width: 1024px)')

  const handlePreloaderComplete = () => {
    setPageAnimationStarted(true)
    setTimeout(() => setShowPreloader(false), 1200) // Hide preloader after animation
  }

  // Prevent scrolling during preloader
  useEffect(() => {
    if (!showPreloader) {
      // Remove loading class when preloader is done
      document.body.classList.remove('loading')
    }
  }, [showPreloader])

  return (
    <div style={{ position: 'relative' }}>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} isExiting={pageAnimationStarted} text="About" />}
      
      {/* Navbar with black text */}
      <Navbar
        forceBlackText={true} // Force black text on this page
        pageAnimationStarted={pageAnimationStarted}
      />

      {/* Page content with animation */}
      <motion.div
        initial={pageEntrance.initial(isMobile)}
        animate={pageAnimationStarted ? pageEntrance.animate(isMobile) : {}}
        style={{
          transformOrigin,
        }}
        className="relative w-screen overflow-x-hidden"
      >
        {/* Use the existing AboutSection component */}
        <div style={{marginTop: '80vh'}}>
          <AboutSection />
        </div>
      </motion.div>
    </div>
  )
}

export default AboutPage