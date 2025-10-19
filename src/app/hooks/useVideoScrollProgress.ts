"use client"

import { useState, useEffect, useRef } from 'react'

export const useVideoScrollProgress = () => {
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

      // Determine when video should start switching based on container progress
      const videoSwitchingThreshold = 0.18 // Start switching at 30% container scroll
      
      if (containerProgress < videoSwitchingThreshold) {
        // Scaling phase - use video position for smooth scaling
        setVideoProgress(videoScaleProgress)
        setCurrentVideoIndex(0)
      } 
      else {
        // Switching phase - use container progress for stable video switching
        setVideoProgress(1)
        const switchingProgress = (containerProgress - videoSwitchingThreshold) / (1 - videoSwitchingThreshold)
        const videoIndex = Math.floor(switchingProgress * 5)
        setCurrentVideoIndex(Math.min(4, videoIndex))
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