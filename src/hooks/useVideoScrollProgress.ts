"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

export const useVideoScrollProgress = (totalVideos: number = 7) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const lastUpdateRef = useRef({ scrollProgress: 0, videoProgress: 0, currentVideoIndex: 0 })
  const totalVideosRef = useRef(totalVideos)

  // Update ref when prop changes
  useEffect(() => {
    totalVideosRef.current = totalVideos
  }, [totalVideos])

  // Easing function for smoother transitions
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }

  const handleScroll = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
    
    frameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !videoRef.current || typeof window === 'undefined') return

      const container = containerRef.current
      const video = videoRef.current
      const containerRect = container.getBoundingClientRect()
      const videoRect = video.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const containerHeight = container.offsetHeight
      
      // Calculate video scaling progress based on video position
      const videoTop = videoRect.top
      const videoStartsVisible = windowHeight
      const videoTopReachesTop = -windowHeight * 0.2 // Extend scaling slightly beyond top of screen
      const videoTravelDistance = videoStartsVisible - videoTopReachesTop
      
      let videoScaleProgress = 0
      if (videoTop <= videoStartsVisible) {
        videoScaleProgress = (videoStartsVisible - videoTop) / videoTravelDistance
      }
      videoScaleProgress = Math.min(1, Math.max(0, videoScaleProgress))
      
      // Calculate overall container scroll progress for video switching
      const totalScrollDistance = containerHeight - windowHeight
      const scrolled = Math.max(0, -containerRect.top)
      const containerProgress = Math.min(1, Math.max(0, scrolled / totalScrollDistance))
      
      // 3-phase scroll logic
      const scaleUpThreshold = 0.25 // Scale up until 25%
      const scaleDownThreshold = 0.65 // Start scaling down at 65%
      
      let newVideoProgress = videoScaleProgress
      let newVideoIndex = 0
      
      if (containerProgress < scaleUpThreshold) {
        // Phase 1: Scale up carousel, stay on video 0
        newVideoProgress = videoScaleProgress
        newVideoIndex = 0
      } 
      else if (containerProgress < scaleDownThreshold) {
        // Phase 2: Fullscreen sliding between videos
        newVideoProgress = 1
        const slidingProgress = (containerProgress - scaleUpThreshold) / (scaleDownThreshold - scaleUpThreshold)
        const videoIndex = Math.floor(slidingProgress * totalVideosRef.current)
        newVideoIndex = Math.min(totalVideosRef.current - 1, videoIndex)
      }
      else {
        // Phase 3: Scale down carousel, stay on last video
        newVideoProgress = 1
        newVideoIndex = totalVideosRef.current - 1
      }

      // Only update state if values actually changed
      const threshold = 0.001
      if (Math.abs(lastUpdateRef.current.scrollProgress - containerProgress) > threshold ||
          Math.abs(lastUpdateRef.current.videoProgress - newVideoProgress) > threshold ||
          lastUpdateRef.current.currentVideoIndex !== newVideoIndex) {
        
        lastUpdateRef.current = { 
          scrollProgress: containerProgress, 
          videoProgress: newVideoProgress, 
          currentVideoIndex: newVideoIndex 
        }
        
        setScrollProgress(containerProgress)
        setVideoProgress(newVideoProgress)
        setCurrentVideoIndex(newVideoIndex)
      }
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollHandler = () => handleScroll()
    
    window.addEventListener('scroll', scrollHandler, { passive: true })
    scrollHandler() // Initial call

    return () => {
      window.removeEventListener('scroll', scrollHandler)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return {
    scrollProgress,
    videoProgress,
    currentVideoIndex,
    containerRef,
    videoRef
  }
}