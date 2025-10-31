"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { WishVideo } from '../data/wishes-videos'

interface VideoPlayerProps {
  video: WishVideo
  index: number
  translateX: number
  scaleX: number
  opacity: number
  isMobile: boolean
  onLoadedData: () => void
  videoRef: (el: HTMLVideoElement | null) => void
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  index,
  translateX,
  scaleX,
  opacity,
  isMobile,
  onLoadedData,
  videoRef
}) => {
  return (
    <motion.video
      key={index}
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      onLoadedData={onLoadedData}
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
}