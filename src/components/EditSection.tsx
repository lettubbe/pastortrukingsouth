"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useAudioContext } from '../providers/AudioProvider'

const EditSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')
  
  // Audio context for pausing/resuming background audio
  const { pauseTemporarily, resumeAudio } = useAudioContext()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!containerRef.current || !videoRef.current) {
            ticking = false
            return
          }

          const container = containerRef.current
          const rect = container.getBoundingClientRect()
          const windowHeight = window.innerHeight

          // Only start calculating progress when section reaches top of viewport
          if (rect.top > 0) {
            setScrollProgress(0)
            ticking = false
            return
          }

          // Use a fixed scroll distance for consistent animation timing
          const scrollStart = Math.abs(rect.top)
          const fixedScrollDistance = windowHeight * 1.5 // 150vh of scroll distance for animation

          // Progress from 0 to 1 over the fixed scroll distance
          const progress = Math.min(1, Math.max(0, scrollStart / fixedScrollDistance))

          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Determine scroll phases
  const isExpandPhase = scrollProgress > 0 && scrollProgress < 0.4
  const isFullScreenPhase = scrollProgress >= 0.4 && scrollProgress < 0.5
  const isScrollUpPhase = scrollProgress >= 0.5

  // Calculate text positions (move inward as scroll progresses)
  const textMoveProgress = isExpandPhase
    ? Math.min(1, scrollProgress / 0.4) // 0 to 1 over 0-0.4 range
    : (isFullScreenPhase || isScrollUpPhase)
      ? 1
      : 0

  // Calculate video dimensions - different for mobile vs desktop
  let videoWidth = 40 // Start at 40vw
  let videoHeight
  let borderRadius = 20

  if (isMobile) {
    // Mobile: Start smaller and expand to taller dimensions
    videoHeight = 30 // Start at 30vw for mobile
    if (isExpandPhase || isFullScreenPhase || isScrollUpPhase) {
      const expandProgress = Math.min(1, scrollProgress / 0.4) // 0-1 over 0-0.4 range
      videoWidth = 40 + (60 * expandProgress) // 40vw -> 100vw
      videoHeight = 30 + (190 * expandProgress) // 30vw -> 220vw (even taller than viewport)
      borderRadius = 20 * (1 - expandProgress) // 20px -> 0px
    }
  } else {
    // Desktop: Original calculation
    videoHeight = 25 // Start at 25vw
    if (isExpandPhase || isFullScreenPhase || isScrollUpPhase) {
      const expandProgress = Math.min(1, scrollProgress / 0.4) // 0-1 over 0-0.4 range
      videoWidth = 40 + (60 * expandProgress) // 40vw -> 100vw
      videoHeight = 25 + (75 * expandProgress) // 25vw -> 100vh
      borderRadius = 20 * (1 - expandProgress) // 20px -> 0px
    }
  }

  // Calculate vertical translation for scroll up phase
  let videoTranslateY = 0
  if (isScrollUpPhase) {
    const scrollUpProgress = (scrollProgress - 0.5) / 0.5 // 0-1 over 0.5-1.0
    videoTranslateY = -100 * 0.6 * scrollUpProgress // Move up by 60vh
  }

  // Calculate opacity for text elements
  const textOpacity = scrollProgress > 0
    ? Math.max(0, 1 - (scrollProgress / 0.5)) // Fade out from 0-0.5
    : 1

  const topTextOpacity = scrollProgress > 0
    ? Math.max(0, 1 - (scrollProgress / 0.4)) // Fade out from 0-0.4
    : 1

  const bottomTextOpacity = scrollProgress > 0
    ? Math.max(0, 1 - (scrollProgress / 0.45)) // Fade out from 0-0.45
    : 1

  // Handle video click
  const handleVideoClick = () => {
    // Pause background audio when entering fullscreen
    pauseTemporarily()
    setIsFullscreen(true)
  }

  // Handle fullscreen close
  const handleCloseFullscreen = () => {
    console.log('Closing fullscreen video')
    setIsFullscreen(false)
    // Resume background audio when exiting fullscreen
    resumeAudio()
  }

  // Prevent scrolling when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      // Store current scroll position
      const scrollY = window.scrollY
      
      // Disable scrolling with multiple methods
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      
      // Prevent wheel and touch events
      const preventScroll = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
      
      return () => {
        // Re-enable scrolling
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        
        // Restore scroll position
        window.scrollTo(0, scrollY)
        
        // Remove event listeners
        document.removeEventListener('wheel', preventScroll)
        document.removeEventListener('touchmove', preventScroll)
      }
    }
  }, [isFullscreen])

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        console.log('Escape key pressed, closing fullscreen')
        handleCloseFullscreen()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isFullscreen])

  return (
    <div
      id="about"
      ref={containerRef}
      style={{
        minHeight: '250vh',
        backgroundColor: '#660033',
        position: 'relative',
        zIndex: 1,
      }}
    >

      {/* Dark overlay on entire container - on top of video */}
      <div style={{
        position: (isExpandPhase || isFullScreenPhase || isScrollUpPhase) ? 'fixed' : 'absolute',
        top: isScrollUpPhase ? `${videoTranslateY}vh` : 0,
        left: 0,
        right: 0,
        bottom: (isExpandPhase || isFullScreenPhase || isScrollUpPhase) ? 0 : 'auto',
        height: (isExpandPhase || isFullScreenPhase || isScrollUpPhase) ? '100vh' : '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Text layer - on top of overlay */}
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          paddingBottom: '16px',
          position: (isExpandPhase || isFullScreenPhase || isScrollUpPhase) ? 'fixed' : 'absolute',
          top: isScrollUpPhase ? `${videoTranslateY}vh` : 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        {/* Small text at top center */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            letterSpacing: '2px',
            textAlign: 'center',
            opacity: topTextOpacity,
            zIndex: 5
          }}
        >
          Highlights
        </motion.p>

        {/* Middle section with Lorem, video, Ipsum */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Lorem on the left */}
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: '700',
              background: 'linear-gradient(180deg, #fff9a3, #FFD700, #b8860b)', // top to bottom gold
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text', // required for Chrome/Safari
              color: 'transparent',
              WebkitTextFillColor: 'transparent', // ensures no fallback color covers gradient
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              lineHeight: '1',
              position: 'absolute',
              left: `calc(5% + ${textMoveProgress * (isMobile ? 13 : 27)}%)`,
              opacity: textOpacity,
              zIndex: 3,
            }}
          >
            Living
          </motion.h2>


          {/* Video in the middle */}
          <motion.div
            ref={videoRef}
            initial={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={handleVideoClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              width: `${videoWidth}vw`,
              height: `${videoHeight}vw`,
              maxHeight: '100vh',
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              boxShadow: borderRadius > 0 ? '0 20px 40px rgba(0,0,0,0.3)' : 'none',
              position: 'relative',
              zIndex: 0,
              transform: isScrollUpPhase ? `translateY(${videoTranslateY}vh)` : 'none',
              cursor: 'none',
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src="https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Edit.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Ipsum on the right */}
          <motion.h2
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: '600',
              background: 'linear-gradient(180deg, #fff9a3, #FFD700, #b8860b)', // top to bottom gold
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text', // required for Chrome/Safari
              color: 'transparent',
              WebkitTextFillColor: 'transparent', // ensures no fallback color covers gradient
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              lineHeight: '1',
              position: 'absolute',
              right: `calc(5% + ${textMoveProgress * (isMobile ? 13 : 27)}%)`,
              opacity: textOpacity,
              zIndex: 3,
            }}
          >
            Proof
          </motion.h2>
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            fontSize: '16px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.6',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            textAlign: 'center',
            paddingLeft: '5%',
            paddingRight: '5%',
            maxWidth: '800px',
            opacity: bottomTextOpacity,
            zIndex: 5
          }}
        >
          <p>Heaven has a better compilation, this is just what we could fit in a 60 second timeframer</p>
          {/* <p>sed do eiusmod tempor incididunt ut</p> */}
        </motion.div>
      </div>

      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 1000,
          backgroundColor: isHovering ? 'white' : 'transparent',
          color: 'black',
          padding: isHovering ? '4px 12px' : '0',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'var(--font-smooch-sans), system-ui, -apple-system, sans-serif',
          fontWeight: 'medium',
          boxShadow: isHovering ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
          transform: 'translate(-50%, -100%)',
          marginTop: '-8px',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {isHovering && 'click'}
      </div>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            // Only close if clicking the background, not the video or button
            if (e.target === e.currentTarget) {
              handleCloseFullscreen()
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleCloseFullscreen()
            }}
            style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000000,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            ✕
          </button>
          
          {/* Fullscreen video */}
          <video
            autoPlay
            controls
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <source src="/video/Edit.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

    </div>
  )
}

export default EditSection