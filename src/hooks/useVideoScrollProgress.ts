"use client"

import { useState, useEffect, useRef } from 'react'

export const useVideoScrollProgress = (totalVideos: number = 7) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)

  // Easing function for smoother transitions
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return

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
      
      setScrollProgress(containerProgress)

      // 3-phase scroll logic
      const scaleUpThreshold = 0.25 // Scale up until 25%
      const scaleDownThreshold = 0.65 // Start scaling down at 65%
      
      if (containerProgress < scaleUpThreshold) {
        // Phase 1: Scale up carousel, stay on video 0
        setVideoProgress(videoScaleProgress)
        setCurrentVideoIndex(0)
      } 
      else if (containerProgress < scaleDownThreshold) {
        // Phase 2: Fullscreen sliding between videos
        setVideoProgress(1)
        const slidingProgress = (containerProgress - scaleUpThreshold) / (scaleDownThreshold - scaleUpThreshold)
        const videoIndex = Math.floor(slidingProgress * totalVideos)
        setCurrentVideoIndex(Math.min(totalVideos - 1, videoIndex))
      }
      else {
        // Phase 3: Scale down carousel, stay on last video
        setVideoProgress(1)
        setCurrentVideoIndex(totalVideos - 1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
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