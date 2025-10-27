"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EditSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  // Calculate video dimensions - start from initial size and only expand
  let videoWidth = 40 // Start at 40vw
  let videoHeight = 25 // Start at 25vw
  let borderRadius = 20

  if (isExpandPhase || isFullScreenPhase || isScrollUpPhase) {
    const expandProgress = Math.min(1, scrollProgress / 0.4) // 0-1 over 0-0.4 range
    videoWidth = 40 + (60 * expandProgress) // 40vw -> 100vw
    videoHeight = 25 + (75 * expandProgress) // 25vw -> 100vh
    borderRadius = 20 * (1 - expandProgress) // 20px -> 0px
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

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '250vh',
        backgroundColor: '#940404',
        position: 'relative',
        zIndex: 100000,
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
          lorem
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
              left: `calc(5% + ${textMoveProgress * 26}%)`,
              opacity: textOpacity,
              zIndex: 3,
            }}
          >
            Lorem
          </motion.h2>


          {/* Video in the middle */}
          <motion.div
            ref={videoRef}
            initial={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
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
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
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
              right: `calc(5% + ${textMoveProgress * 26}%)`,
              opacity: textOpacity,
              zIndex: 3,
            }}
          >
            Ipsum
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
          <p>Lorem ipsum dolor sit amet consectetur</p>
          <p>sed do eiusmod tempor incididunt ut</p>
        </motion.div>
      </div>

    </div>
  )
}

export default EditSection