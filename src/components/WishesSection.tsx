"use client"

import React from 'react'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useVideoScrollProgress } from '../hooks/useVideoScrollProgress'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useAudioContext } from '../providers/AudioProvider'

interface WishesSectionProps {
  // No longer need audio props since we use global context
}

const WishesSection: React.FC<WishesSectionProps> = () => {
  // Use global audio context
  const { pauseTemporarily, resumeAudio } = useAudioContext();
  const videoElements = React.useRef<(HTMLVideoElement | null)[]>([]);
  const iSpanRef = React.useRef<HTMLSpanElement | null>(null);
  const [wasBackgroundPaused, setWasBackgroundPaused] = React.useState(false);
  const [iPosition, setIPosition] = React.useState<{top: number, left: number} | null>(null);
  const [videosLoaded, setVideosLoaded] = React.useState<boolean[]>(new Array(7).fill(false));
  const isMobile = useMediaQuery('(max-width: 1024px)');
  
  // S3 video URLs for WishesSection
  const videos = [
    {
      id: 'wife-upgrade',
      title: "Wife",
      thumbnail: "https://picsum.photos/300/300?random=1",
      videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Ms.+UpgradeMain%5Bwife%5D.mp4",
      audioUrl: undefined,
      x: 15,
      y: 20,
      size: 120,
      color: '#ff6b6b',
      caption: "Wife",
      authorName: "Wife",
      createdAt: new Date().toISOString()
    },
    {
      id: 'wife-kids',
      title: "Wife&Kids", 
      thumbnail: "https://picsum.photos/300/300?random=2",
      videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/wife%26kids.mp4",
      audioUrl: undefined,
      x: 85,
      y: 25,
      size: 100,
      color: '#4ecdc4',
      caption: "Wife&Kids",
      authorName: "Wife&Kids",
      createdAt: new Date().toISOString()
    },
    {
      id: 'Pst-isreal',
      title: "Brother", 
      thumbnail: "https://picsum.photos/300/300?random=2",
      videoUrl: isMobile 
        ? "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Pastor+Israel+Atima.mp4"
        : "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Pastor+Israel+Atima+-+HBD+P.TSK.mp4",
      audioUrl: undefined,
      x: 85,
      y: 25,
      size: 100,
      color: '#4ecdc4',
      caption: "Brother",
      authorName: "Brother",
      createdAt: new Date().toISOString()
    },
    {
      id: 'sister-esther',
      title: "Sister", 
      thumbnail: "https://picsum.photos/300/300?random=4",
      videoUrl: isMobile 
        ? "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Esther+Atima.mp4"
        : "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Esther+Atima+-+HBD+P.TSK.mp4",
      audioUrl: undefined,
      x: 60,
      y: 40,
      size: 120,
      color: '#e17055',
      caption: "Sister",
      authorName: "Sister",
      createdAt: new Date().toISOString()
    },
    {
      id: 'tb1',
      title: "TB1",
      thumbnail: "https://picsum.photos/300/300?random=3",
      videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/TB1.mov",
      audioUrl: undefined,
      x: 10,
      y: 75,
      size: 140,
      color: '#45b7d1',
      caption: "TB1",
      authorName: "TB1",
      createdAt: new Date().toISOString()
    },
    {
      id: 'protek',
      title: "Protek",
      thumbnail: "https://picsum.photos/300/300?random=4",
      videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Protek.mp4",
      audioUrl: undefined,
      x: 75,
      y: 10,
      size: 130,
      color: '#ffeaa7',
      caption: "Protek",
      authorName: "Protek",
      createdAt: new Date().toISOString()
    },
    {
      id: 'peddygree',
      title: "Peddygree",
      thumbnail: "https://picsum.photos/300/300?random=5",
      videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Peddygree.mov",
      audioUrl: undefined,
      x: 30,
      y: 50,
      size: 110,
      color: '#fd79a8',
      caption: "Peddygree",
      authorName: "Peddygree",
      createdAt: new Date().toISOString()
    }
  ];
  
  const { scrollProgress, videoProgress, currentVideoIndex, containerRef, videoRef } = useVideoScrollProgress(videos.length)
  const videoTexts = videos.map(video => video.authorName || 'Anonymous');

  // Determine current scroll phase
  const isScaleUpPhase = scrollProgress < 0.25
  const isSlidingPhase = scrollProgress >= 0.25 && scrollProgress < 0.65
  const isScaleDownPhase = scrollProgress >= 0.65
  const scaleDownProgress = isScaleDownPhase ? Math.min(1, (scrollProgress - 0.65) / 0.35) : 0

  // Calculate dynamic dimensions with different behavior for mobile vs desktop
  let maxWidth, maxHeight
  
  if (isSlidingPhase) {
    // During sliding phase: Full screen on mobile, landscape container on desktop
    if (isMobile) {
      // Mobile: Full viewport width and height, no spacing
      maxWidth = 100 // Use 100% width for full mobile viewing
      maxHeight = window.innerHeight // Full viewport height
    } else {
      // Desktop: Landscape container spanning full width
      maxHeight = window.innerHeight // Full viewport height
      maxWidth = 100 // Full viewport width for edge-to-edge black bars
    }
  } else {
    // During scale up and scale down phases: Progressive sizing
    if (isMobile) {
      // Mobile: Progressive sizing that stays within screen
      const startWidth = 65
      const endWidth = 100
      maxWidth = Math.min(endWidth, startWidth + (videoProgress * (endWidth - startWidth)))
      
      const startHeight = window.innerHeight * 0.6 // Start at reasonable size
      const endHeight = window.innerHeight // End at full viewport height
      maxHeight = startHeight + (videoProgress * (endHeight - startHeight))
    } else {
      // Desktop: Progressive sizing to full-width landscape container
      const startHeight = 400
      const endHeight = window.innerHeight // Full viewport height
      maxHeight = startHeight + (videoProgress * (endHeight - startHeight))
      
      // Progressive width to full viewport width for edge-to-edge black bars
      const startWidth = (startHeight * (16/9)) / window.innerWidth * 100 // Start with 16:9 aspect ratio
      const endWidth = 100 // End at full viewport width
      maxWidth = startWidth + (videoProgress * (endWidth - startWidth))
    }
  }

  // Scale down during scale down phase - mobile stays within screen
  if (isScaleDownPhase && scaleDownProgress > 0) {
    if (isMobile) {
      // Mobile: Scale down from full height to small circle
      const mobileMaxHeight = window.innerHeight // Start from full viewport height
      maxHeight = mobileMaxHeight - (scaleDownProgress * (mobileMaxHeight - 20)) // Smaller final size
      maxWidth = 100 - (scaleDownProgress * 98) // Scale down from mobile sliding width
    } else {
      // Desktop: Scale down from full-width landscape container
      const desktopMaxHeight = window.innerHeight // Full viewport height
      maxHeight = desktopMaxHeight - (scaleDownProgress * (desktopMaxHeight - 20)) // Smaller final size
      // Scale down from full viewport width to final circle size
      maxWidth = 100 - (scaleDownProgress * 98)
    }

    // In final stages, morph to circle by making width equal to height
    if (scaleDownProgress > 0.7) {
      const morphProgress = (scaleDownProgress - 0.7) / 0.3 // 0 to 1 for morph phase
      const targetWidth = (maxHeight / window.innerWidth) * 100 // Convert height to width percentage
      maxWidth = maxWidth + (targetWidth - maxWidth) * morphProgress
    }
  }


  // Handle video audio and background audio based on scroll progress
  React.useEffect(() => {
    // Background audio control
    if (isSlidingPhase && !wasBackgroundPaused) {
      pauseTemporarily();
      setWasBackgroundPaused(true);
    } else if (!isSlidingPhase && wasBackgroundPaused) {
      resumeAudio();
      setWasBackgroundPaused(false);

      // Ensure ALL videos are muted when leaving sliding phase
      videoElements.current.forEach((video, index) => {
        if (video && !video.muted) {
          console.log(`Force muting video ${index} when leaving sliding phase`);
          video.muted = true;
        }
      });
    }

    // Enhanced video control with position caching
    videoElements.current.forEach((video, index) => {
      if (!video) return;

      const isActive = index === currentVideoIndex;

      if (isSlidingPhase && isActive) {
        // Reset to beginning and play active video with audio
        video.currentTime = 0;
        video.muted = false;
        video.play().catch(() => {});
      } else {
        // Mute, pause, and reset inactive videos
        video.muted = true;
        if (!isActive) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

  }, [scrollProgress, currentVideoIndex, isSlidingPhase, isScaleDownPhase, scaleDownProgress, wasBackgroundPaused, pauseTemporarily, resumeAudio]);

  // Progressive buffering for adjacent videos
  React.useEffect(() => {
    if (!isSlidingPhase) return;

    // Preload adjacent videos for smoother transitions
    const adjacentIndices = [
      Math.max(0, currentVideoIndex - 1),
      Math.min(videos.length - 1, currentVideoIndex + 1)
    ];

    adjacentIndices.forEach(index => {
      const video = videoElements.current[index];
      if (video && !videosLoaded[index]) {
        // Trigger loading of adjacent videos
        video.load();
      }
    });
  }, [currentVideoIndex, isSlidingPhase, videosLoaded, videos.length]);

  // Measure "i" position when video needs to move there
  React.useEffect(() => {
    if (isScaleDownPhase && scaleDownProgress >= 1.0 && iSpanRef.current) {
      const rect = iSpanRef.current.getBoundingClientRect();
      // Position for dot above the "i" - center horizontally, slightly above the span
      setIPosition({
        top: rect.top - (isMobile ? 8 : 12), // Position above the "i" span
        left: rect.left + rect.width / 2.8 - (isMobile ? 8 : 8)
      });
    } else if (scaleDownProgress < 1.0) {
      setIPosition(null); // Clear position when not needed
    }
  }, [isScaleDownPhase, scaleDownProgress, isMobile]);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '400vh',
        width: '100%',
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
            fontSize: '14px',
            fontWeight: '600',
            color: 'black',
            marginBottom: '20px',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            letterSpacing: '2px',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          The man | The Mission | The Miracle
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
            marginBottom: '20px',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            lineHeight: '1',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          Testimonies
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            fontSize: '18px',
            fontWeight: '400',
            color: '#333',
            lineHeight: '1.6',
            marginBottom: '60px',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            paddingLeft: '5%',
            paddingRight: '5%',
            maxWidth: isMobile ? '80vw' : '50vw'
          }}
        >
          <p>Family and loved ones reflect on the man behind the ministry. Celebrating excellence, the relentless discipline, and the grace that never runs dry.</p>
          {/* <p>Celebrating excellence, the relentless discipline.</p>
          <p>ilabore et dolore magna ancididunt ut</p> */}
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
            backgroundColor: !isMobile ? 'black' : 'transparent',
            position: (isSlidingPhase || isScaleDownPhase) ? 'fixed' : 'relative',
            top: isSlidingPhase
              ? '0' // Both mobile and desktop: start at top of screen
              : isScaleDownPhase && scaleDownProgress > 0
                ? iPosition && scaleDownProgress >= 1.0
                  ? `${iPosition.top}px` // Use exact measured position
                  : `calc(30vh - ${maxHeight / 2}px)` // Normal scale down position
                : '0',
            transition: scaleDownProgress >= 1.0 && iPosition ? 'top 0.5s ease-out, left 0.5s ease-out' : 'top 0.3s ease-out',
            left: isSlidingPhase
              ? !isMobile ? '0' : `calc(50vw - ${maxWidth / 2}%)`
              : isScaleDownPhase && scaleDownProgress > 0
                ? iPosition && scaleDownProgress >= 1.0
                  ? `${iPosition.left}px` // Use exact measured position
                  : `calc(50vw - ${maxWidth / 2}%)`
                : '0',
            transform: 'none',
            zIndex: isSlidingPhase ? 1000 : 'auto',
            margin: '0 auto',
            opacity: 1
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {videos.map((video, index) => {
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
                } else if (isPrev && currentVideoIndex > 0) {
                  translateX = -50
                  scaleX = 0
                  opacity = 0
                } else if (isNext && currentVideoIndex < videos.length - 1) {
                  translateX = 50
                  scaleX = 0
                  opacity = 0
                } else if (index < currentVideoIndex) {
                  translateX = -100
                  scaleX = 0
                  opacity = 0
                } else if (index > currentVideoIndex) {
                  translateX = 100
                  scaleX = 0
                  opacity = 0
                } else {
                  // Fallback for edge cases
                  translateX = 0
                  scaleX = 1
                  opacity = 0
                }
              }

              return (
                <motion.video
                  key={index}
                  ref={(el) => {
                    if (el) {
                      videoElements.current[index] = el;
                    }
                  }}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => {
                    setVideosLoaded(prev => {
                      const newLoaded = [...prev];
                      newLoaded[index] = true;
                      return newLoaded;
                    });
                  }}
                  animate={{
                    x: `${translateX}%`,
                    scaleX: scaleX,
                    opacity: opacity
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: isMobile ? 'cover' : 'contain',
                    transformOrigin: 'center'
                  }}
                >
                  <source src={video.videoUrl || video.thumbnail || ''} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              )
            })}
          </div>

          {/* Text overlay for videos - only visible during sliding phase */}
          {isSlidingPhase && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1002,
                textAlign: 'center',
                pointerEvents: 'none',
                height: '20%',
                overflow: 'hidden'
              }}
            >
              {videoTexts.map((text, index) => {
                const isActive = index === currentVideoIndex
                const isPrev = index === currentVideoIndex - 1
                const isNext = index === currentVideoIndex + 1

                let translateY = 0
                let scaleY = 1
                let opacity = 0

                if (isActive) {
                  translateY = 0
                  scaleY = 1
                  opacity = 1
                } else if (isPrev) {
                  translateY = -50
                  scaleY = 0
                  opacity = 0
                } else if (isNext) {
                  translateY = 50
                  scaleY = 0
                  opacity = 0
                } else if (index < currentVideoIndex) {
                  translateY = -100
                  scaleY = 0
                  opacity = 0
                } else {
                  translateY = 100
                  scaleY = 0
                  opacity = 0
                }

                return (
                  <motion.h2
                    key={index}
                    initial={{
                      y: `${translateY}%`,
                      scaleY: scaleY,
                      opacity: opacity
                    }}
                    animate={{
                      y: `${translateY}%`,
                      scaleY: scaleY,
                      opacity: opacity
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0, 0.1, 1]
                    }}
                    style={{
                      position: 'fixed',
                      fontSize: 'clamp(24px, 4vw, 48px)',
                      fontWeight: '700',
                      color: 'white',
                      fontFamily: 'var(--font-style-script), cursive',
                      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)',
                      lineHeight: '1.2',
                      margin: 0,
                      letterSpacing: '1px',
                      transformOrigin: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {text}
                  </motion.h2>
                )
              })}
            </div>
          )}

          {/* Loading indicator for current video */}
          {isSlidingPhase && !videosLoaded[currentVideoIndex] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1003,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50px',
                padding: '20px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%'
                }}
              />
            </motion.div>
          )}

        </motion.div>


        {/* Happy Birthday text */}
        {isScaleDownPhase && (
          <div
            style={{
              position: 'fixed',
              top: `calc(45vh - ${maxHeight / 2}px + ${maxHeight * 0.4}px)`,
              left: '0',
              right: '0',
              transform: 'translateY(-50%)',
              zIndex: 'auto',
              fontSize: 'clamp(60px, 12vw, 200px)',
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
                  fontSize: isMobile ? '0.8em' : '1em',
                  transform: scaleDownProgress > 0.2 ? `translateY(${Math.max(0, 100 - ((scaleDownProgress - 0.2) * 250))}%)` : 'translateY(100%)',
                  opacity: Math.max(0, Math.min(1, (scaleDownProgress - 0.1) * 5)),
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
              >
                B
              </span>

              {/* i rectangle */}
              <span ref={iSpanRef} style={{ position: 'relative', display: 'inline-block' }}>
                {/* Regular red rectangle - the i stem */}
                <div
                  style={{
                    display: 'inline-block',
                    width: isMobile ? '8px' : '22px',
                    height: isMobile ? '42px' : '100px',
                    backgroundColor: 'black',
                    // backgroundColor: '#940404',
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
                    fontSize: isMobile ? '0.8em' : '1em',
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
              top: isMobile ? '50%' : '56%',
              left: '0',
              right: '0',
              transform: 'translateY(-50%)',
              zIndex: 'auto',
              fontSize: 'clamp(80px, 12vw, 200px)',
              fontWeight: '600',
              color: '#C9952F',
              fontFamily: 'var(--font-smooch-sans), sans-serif',
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