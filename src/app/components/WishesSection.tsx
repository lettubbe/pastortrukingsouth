"use client"

import React from 'react'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useVideoScrollProgress } from '../hooks/useVideoScrollProgress'

const WishesSection = () => {
  const { scrollProgress, videoProgress, currentVideoIndex, containerRef, videoRef } = useVideoScrollProgress()
  
  // Calculate dynamic dimensions to prevent jumping
  const maxWidth = Math.min(100, 65 + (videoProgress * 40))
  const maxHeight = 300 + (videoProgress * 500)

  const videos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  ]

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '400vh',
        backgroundColor: '#D6E5F8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '100px',
        position: 'relative'
      }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'left',
          width: '100%',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'black',
            marginBottom: '20px',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            letterSpacing: '2px',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          Lorem Ipsum
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(60px, 8vw, 120px)',
            fontWeight: '600',
            color: 'black',
            marginBottom: '40px',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            lineHeight: '1',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          consectetur
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            fontSize: '24px',
            fontWeight: '400',
            color: '#333',
            lineHeight: '1.6',
            marginBottom: '60px',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          <p>adipiscing elit sed do eiusmod tempor </p>
          <p>incididunt ut labore et dolore magna aliqua ut enim.</p>
          <p>ilabore et dolore magna ancididunt ut</p>
        </motion.div>

        <motion.div
          ref={videoRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
          style={{
            width: `${maxWidth}%`,
            height: `${maxHeight}px`,
            borderRadius: `${20 * (1 - videoProgress)}px`,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: videoProgress === 1 && currentVideoIndex > 0 ? 'fixed' : 'relative',
            top: videoProgress === 1 && currentVideoIndex > 0 ? '0' : 'auto',
            left: videoProgress === 1 && currentVideoIndex > 0 ? '0' : 'auto',
            zIndex: videoProgress === 1 && currentVideoIndex > 0 ? 1000 : 'auto',
            margin: '0 auto'
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}>
            {videos.map((videoSrc, index) => {
              const isActive = index === currentVideoIndex
              const isPrev = index === currentVideoIndex - 1
              const isNext = index === currentVideoIndex + 1

              let translateX = 0
              let opacity = 0

              if (isActive) {
                translateX = 0
                opacity = 1
              } else if (isPrev) {
                translateX = -100
                opacity = 0.3
              } else if (isNext) {
                translateX = 100
                opacity = 0.3
              } else if (index < currentVideoIndex) {
                translateX = -200
                opacity = 0
              } else {
                translateX = 200
                opacity = 0
              }

              return (
                <motion.video
                  key={index}
                  autoPlay
                  muted
                  loop
                  playsInline
                  animate={{
                    x: `${translateX}%`,
                    opacity: opacity,
                    rotateY: translateX * 0.2
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default WishesSection