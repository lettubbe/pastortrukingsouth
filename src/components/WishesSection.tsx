"use client"

import React from 'react'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useVideoScrollProgress } from '../hooks/useVideoScrollProgress'

interface WishesSectionProps {
  onPauseBackgroundAudio: () => void;
  onResumeBackgroundAudio: () => void;
}

const WishesSection: React.FC<WishesSectionProps> = ({
  onPauseBackgroundAudio,
  onResumeBackgroundAudio
}) => {
  const { scrollProgress, videoProgress, currentVideoIndex, containerRef, videoRef } = useVideoScrollProgress()
  const videoElements = React.useRef<(HTMLVideoElement | null)[]>([]);
  const [wasBackgroundPaused, setWasBackgroundPaused] = React.useState(false);

  // Determine current scroll phase
  const isScaleUpPhase = scrollProgress < 0.25
  const isSlidingPhase = scrollProgress >= 0.25 && scrollProgress < 0.65
  const isScaleDownPhase = scrollProgress >= 0.65
  const scaleDownProgress = isScaleDownPhase ? Math.min(1, (scrollProgress - 0.65) / 0.35) : 0

  // Calculate dynamic dimensions to prevent jumping
  let maxWidth = Math.min(100, 65 + (videoProgress * 40))
  let maxHeight = 300 + (videoProgress * 500)

  // Scale down during scale down phase
  if (isScaleDownPhase && scaleDownProgress > 0) {
    // Normal scaling down (rectangle)
    maxWidth = 100 - (scaleDownProgress * 95) // Scale down to 5% width
    maxHeight = 800 - (scaleDownProgress * 760) // Scale down to 40px height

    // In final stages, morph to circle by making width equal to height
    if (scaleDownProgress > 0.7) {
      const morphProgress = (scaleDownProgress - 0.7) / 0.3 // 0 to 1 for morph phase
      const targetWidth = (maxHeight / window.innerWidth) * 100 // Convert height to width percentage
      maxWidth = maxWidth + (targetWidth - maxWidth) * morphProgress
    }
  }

  // Handle video audio and background audio based on scroll progress
  React.useEffect(() => {
    console.log(`Scroll effect: isSlidingPhase: ${isSlidingPhase}, currentVideoIndex: ${currentVideoIndex}`);

    // Background audio control
    if (isSlidingPhase && !wasBackgroundPaused) {
      console.log('Pausing background audio for video playback');
      onPauseBackgroundAudio();
      setWasBackgroundPaused(true);
    } else if (!isSlidingPhase && wasBackgroundPaused) {
      console.log('Resuming background audio');
      onResumeBackgroundAudio();
      setWasBackgroundPaused(false);

      // Ensure ALL videos are muted when leaving sliding phase
      videoElements.current.forEach((video, index) => {
        if (video && !video.muted) {
          console.log(`Force muting video ${index} when leaving sliding phase`);
          video.muted = true;
        }
      });
    }

    // Video audio control
    videoElements.current.forEach((video, index) => {
      if (!video) return;

      const isActive = index === currentVideoIndex;

      if (isScaleDownPhase && scaleDownProgress > 0.5) {
        // Late scale down phase - pause video and mute
        console.log(`Video ${index}: Pausing and muting (late scale down)`);
        video.muted = true;
        video.pause();
      } else if (isScaleDownPhase) {
        // Early scale down phase - mute and continue
        console.log(`Video ${index}: Scale down phase - muted`);
        video.muted = true;
        if (isActive) video.play().catch(e => console.log('Video play failed:', e));
      } else if (isSlidingPhase && isActive) {
        // Sliding phase - restart with audio (only for active video)
        console.log(`Video ${index}: Sliding phase with audio`);
        video.currentTime = 0;
        video.muted = false;
        video.volume = 0.5;
        video.play().catch(e => console.log('Video play failed:', e));
      } else {
        // All other phases - ensure muted
        if (!video.muted) {
          console.log(`Video ${index}: Ensuring muted`);
          video.muted = true;
        }
        if (isActive) {
          console.log(`Video ${index}: Scale up phase - muted`);
          video.play().catch(e => console.log('Video play failed:', e));
        }
      }
    });
  }, [scrollProgress, currentVideoIndex, isSlidingPhase, isScaleDownPhase, scaleDownProgress, wasBackgroundPaused, onPauseBackgroundAudio, onResumeBackgroundAudio]);

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
        backgroundColor: '#FFFDFA',
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
            borderRadius: (() => {
              if (isScaleDownPhase && scaleDownProgress > 0.7) {
                const morphProgress = (scaleDownProgress - 0.7) / 0.3 // 0 to 1 for morph phase
                return `${morphProgress * 50}%` // Gradually transition from 0% to 50%
              }
              return isScaleDownPhase && scaleDownProgress > 0
                ? `${20 * (1 - videoProgress)}px`
                : `${20 * (1 - videoProgress)}px`
            })(),
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: (isSlidingPhase || isScaleDownPhase) ? 'fixed' : 'relative',
            top: isScaleDownPhase && scaleDownProgress > 0
              ? `calc(50vh - ${maxHeight / 2}px - 150px)`
              : '0',
            left: isScaleDownPhase && scaleDownProgress > 0
              ? `calc(50vw - ${maxWidth / 2}vw)`
              : '0',
            transform: 'none',
            zIndex: isScaleDownPhase && scaleDownProgress > 0 ? 1001 : (isSlidingPhase ? 1000 : 'auto'),
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
              let scaleX = 1
              let opacity = 0

              if (isScaleUpPhase || isScaleDownPhase) {
                // During scale up and scale down: only show active video, no sliding
                if (isActive) {
                  translateX = 0
                  scaleX = 1
                  opacity = 1
                } else {
                  translateX = 0
                  scaleX = 1
                  opacity = 0
                }
              } else if (isSlidingPhase) {
                // During sliding phase: accordion sliding transitions
                if (isActive) {
                  translateX = 0
                  scaleX = 1
                  opacity = 1
                } else if (isPrev) {
                  translateX = -50
                  scaleX = 0
                  opacity = 0
                } else if (isNext) {
                  translateX = 50
                  scaleX = 0
                  opacity = 0
                } else if (index < currentVideoIndex) {
                  translateX = -100
                  scaleX = 0
                  opacity = 0
                } else {
                  translateX = 100
                  scaleX = 0
                  opacity = 0
                }
              }

              return (
                <motion.video
                  key={index}
                  ref={(el) => {
                    videoElements.current[index] = el;
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  animate={{
                    x: `${translateX}%`,
                    scaleX: scaleX,
                    opacity: opacity
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0, 0.1, 1]
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transformOrigin: 'center',
                    filter: isScaleDownPhase && scaleDownProgress > 0.3 ? 'brightness(0)' : 'none'
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              )
            })}
          </div>

        </motion.div>

        {/* Happy Birthday text */}
        {isScaleDownPhase && (
          <div
            style={{
              position: 'fixed',
              top: '40%',
              left: '0',
              right: '0',
              transform: 'translateY(-50%)',
              zIndex: 999,
              fontSize: 'clamp(80px, 12vw, 200px)',
              fontWeight: '700',
              color: 'black',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              textAlign: 'center',
              lineHeight: '1',
              // pointerEvents: 'none',
              // opacity: Math.max(0, 1 - (scaleDownProgress - 0.7) * 5)
            }}
          >
            <span style={{ position: 'relative' }}>
              {/* Happy */}
              {"Happy".split("").map((char, i) => (
                <span
                  key={`happy-${i}`}
                  style={{
                    display: 'inline-block',
                    fontSize: '0.765em',
                    transform: scaleDownProgress > 0 ? `translateY(${Math.max(0, 100 - (scaleDownProgress * 200) - (i * 20))}%)` : 'translateY(100%)',
                    opacity: Math.max(0, Math.min(1, (scaleDownProgress * 5) - (i * 0.3))),
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                  }}
                >
                  {char}
                </span>
              ))}
              <span style={{ fontSize: '0.735em' }}> </span>

              {/* B */}
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '1em',
                  transform: scaleDownProgress > 0.2 ? `translateY(${Math.max(0, 100 - ((scaleDownProgress - 0.2) * 250))}%)` : 'translateY(100%)',
                  opacity: Math.max(0, Math.min(1, (scaleDownProgress - 0.1) * 5)),
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
              >
                B
              </span>

              {/* i rectangle and rthday */}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '22px',
                    height: '100px',
                    backgroundColor: '#940404',
                    verticalAlign: 'baseline',
                    marginTop: '20px',
                    transform: scaleDownProgress > 0.3 ? `translateY(${Math.max(0, 100 - ((scaleDownProgress - 0.3) * 250))}%)` : 'translateY(100%)',
                    opacity: Math.max(0, Math.min(1, (scaleDownProgress - 0.2) * 5)),
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                  }}
                />
              </span>

              {"rthday".split("").map((char, i) => (
                <span
                  key={`rthday-${i}`}
                  style={{
                    display: 'inline-block',
                    fontSize: '1em',
                    transform: scaleDownProgress > 0.4 ? `translateY(${Math.max(0, 100 - ((scaleDownProgress - 0.4) * 200) - (i * 15))}%)` : 'translateY(100%)',
                    opacity: Math.max(0, Math.min(1, (scaleDownProgress - 0.3) * 5 - (i * 0.2))),
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        )}

        {/* Tru South King */}
        {isScaleDownPhase && scaleDownProgress > 0.6 && (
          <div
            style={{
              position: 'fixed',
              top: '52%',
              left: '0',
              right: '0',
              transform: 'translateY(-50%)',
              zIndex: 999,
              fontSize: 'clamp(60px, 12vw, 200px)',
              fontWeight: '600',
              color: '#C9952F',
              fontFamily: 'serif',
              textAlign: 'center',
              lineHeight: '1',
              pointerEvents: 'none',
              textShadow: '20px'
            }}
          >
            {/* Tru South King */}
            {"Pst. Tru South".split("").map((char, i) => (
              <span
                key={`tru-${i}`}
                style={{
                  display: 'inline-block',
                  transform: scaleDownProgress > 0.6 ? `translateY(${Math.max(0, 100 - ((scaleDownProgress - 0.6) * 250) - (i * 10))}%)` : 'translateY(100%)',
                  opacity: Math.max(0, Math.min(1, (scaleDownProgress - 0.5) * 5 - (i * 0.1))),
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default WishesSection