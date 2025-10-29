"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Double } from './Double';
import Image from 'next/image';

interface VideoElement {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

const PostPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0, relX: 0, relY: 0 });
  const scrollOffset = useRef(0);
  const hoveredVideoRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [fullscreenVideo, setFullscreenVideo] = useState<number | null>(null);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 44, height: 44 });
  const [isHoveringContent, setIsHoveringContent] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const videos: VideoElement[] = [
    { id: 1, title: "Adventure", thumbnail: 'https://picsum.photos/300/300?random=1', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', x: 15, y: 20, size: 120, color: '#ff6b6b' },
    { id: 2, title: "Nature", thumbnail: 'https://picsum.photos/300/300?random=2', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', x: 85, y: 25, size: 100, color: '#4ecdc4' },
    { id: 3, title: "City", thumbnail: 'https://picsum.photos/300/300?random=3', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', x: 10, y: 75, size: 140, color: '#45b7d1' },
    { id: 4, title: "Ocean", thumbnail: 'https://picsum.photos/300/300?random=4', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', x: 90, y: 80, size: 110, color: '#96ceb4' },
    { id: 5, title: "Mountain", thumbnail: 'https://picsum.photos/300/300?random=5', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', x: 75, y: 10, size: 130, color: '#ffeaa7' },
    { id: 6, title: "Space", thumbnail: 'https://picsum.photos/300/300?random=6', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', x: 80, y: 60, size: 90, color: '#fd79a8' },
    { id: 7, title: "Forest", thumbnail: 'https://picsum.photos/300/300?random=7', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', x: 30, y: 90, size: 80, color: '#a29bfe' },
    { id: 8, title: "Desert", thumbnail: 'https://picsum.photos/300/300?random=8', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', x: 20, y: 45, size: 160, color: '#fd7f28' }
  ];

  const postsData = [
    [
      { 
        src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop', 
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.', 
        date: '2 hours ago' 
      },
      { 
        src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', 
        type: 'image' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.', 
        date: '1 day ago' 
      }
    ],
    [
      { 
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
        type: 'text' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
        date: '3 days ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      { 
        src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop', 
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        type: 'video' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.', 
        date: '5 days ago' 
      }
    ],
    [
      { 
        src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop', 
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        type: 'audio' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.', 
        date: '1 week ago' 
      },
      { 
        src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop', 
        type: 'image' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
        date: '1 week ago' 
      }
    ],
    [
      { 
        src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
        type: 'text' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.', 
        date: '2 weeks ago',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.'
      },
      { 
        src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop', 
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        type: 'audio' as const,
        name: 'Lorem Ipsum', 
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.', 
        date: '2 weeks ago' 
      }
    ]
  ];

  // Video handling functions
  const handleVideoHover = (videoId: number, isEntering: boolean) => {
    const newHoveredVideo = isEntering ? videoId : null;
    hoveredVideoRef.current = newHoveredVideo;
    setHoveredVideo(newHoveredVideo);
    setIsHovering(isEntering);
    
    const videoIndex = videos.findIndex(v => v.id === videoId);
    const video = videoRefs.current[videoIndex];
    
    if (video) {
      if (isEntering) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  };

  const handleVideoClick = (videoId: number) => {
    setFullscreenVideo(videoId);
    const videoIndex = videos.findIndex(v => v.id === videoId);
    const element = elementsRef.current[videoIndex];
    
    if (element) {
      // Animate to fullscreen
      gsap.to(element, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        zIndex: 1000,
        duration: 0.8,
        ease: "power3.inOut"
      });
      
      // Hide other elements
      elementsRef.current.forEach((el, idx) => {
        if (idx !== videoIndex && el) {
          gsap.to(el, { opacity: 0, duration: 0.5 });
        }
      });
      
      // Hide title
      if (titleRef.current) {
        gsap.to(titleRef.current, { opacity: 0, duration: 0.5 });
      }
    }
  };

  const closeFullscreen = () => {
    if (fullscreenVideo === null) return;
    
    const videoIndex = videos.findIndex(v => v.id === fullscreenVideo);
    const element = elementsRef.current[videoIndex];
    const video = videos[videoIndex];
    
    if (element) {
      // Animate back to original position
      gsap.to(element, {
        position: 'absolute',
        top: `${video.y}%`,
        left: `${video.x}%`,
        width: `${video.size}px`,
        height: `${video.size}px`,
        borderRadius: '16px',
        zIndex: 'auto',
        transform: 'translate(-50%, -50%)',
        duration: 0.8,
        ease: "power3.inOut"
      });
      
      // Show other elements
      elementsRef.current.forEach((el) => {
        if (el) {
          gsap.to(el, { opacity: 1, duration: 0.5, delay: 0.3 });
        }
      });
      
      // Show title
      if (titleRef.current) {
        gsap.to(titleRef.current, { opacity: 1, duration: 0.5, delay: 0.3 });
      }
    }
    
    setFullscreenVideo(null);
  };

  const handleCreatePostClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      });
    }
    setShowPostOptions(true);
  };

  useEffect(() => {
    // Close modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (showPostOptions && (event.target as HTMLElement).classList.contains('bg-opacity-50')) {
        setShowPostOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPostOptions]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize GSAP timeline
    const tl = gsap.timeline();

    // Animate elements in on load
    elementsRef.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, {
          scale: 0,
          rotation: Math.random() * 360,
          opacity: 0
        });
        
        tl.to(el, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.8)",
          delay: index * 0.1
        }, 0);
      }
    });

    // Animate title
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
      );
    }

    // Parallax scroll handler
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxSpeed = -1.5; // Videos move up faster than normal scroll
      scrollOffset.current = scrollY * parallaxSpeed;
    };

    // Mouse move handler with cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.relX = (e.clientX / window.innerWidth) - 0.5;
      mousePos.current.relY = (e.clientY / window.innerHeight) - 0.5;

      // Update custom cursor position
      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    // Continuous animation loop
    const animateElements = () => {
      const maxDimension = Math.max(window.innerWidth, window.innerHeight);
      const proximityRadius = 0.15 * maxDimension;

      elementsRef.current.forEach((el, index) => {
        if (el) {
          
          const elementRect = el.getBoundingClientRect();
          const elementCenterX = elementRect.left + elementRect.width / 2;
          const elementCenterY = elementRect.top + elementRect.height / 2;
          
          // Calculate distance from mouse to element center
          const deltaX = mousePos.current.x - elementCenterX;
          const deltaY = mousePos.current.y - elementCenterY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // hover scaling for specific video
          let moveTowardCenter = { x: 0, y: 0 };
          let scaleMultiplier = 1;
          
          if (hoveredVideoRef.current === videos[index]?.id) {
            // Calculate exact scale to reach target absolute size
            const targetSize = 300;
            scaleMultiplier = targetSize / videos[index].size;
            
            // Move toward center of screen
            const currentElementRect = el.getBoundingClientRect();
            const currentCenterX = currentElementRect.left + currentElementRect.width / 2;
            const currentCenterY = currentElementRect.top + currentElementRect.height / 2;
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;
            
            moveTowardCenter.x = (screenCenterX - currentCenterX) * 0.3;
            moveTowardCenter.y = (screenCenterY - currentCenterY) * 0.3;
          } else {
            // Proximity-based scaling for non-hovered videos (only when no video is hovered)
            if (hoveredVideoRef.current === null && distance < proximityRadius) {
              scaleMultiplier = 1 + (1 - distance / proximityRadius) * 0.8;
            }
            
            // Slightly shrink other videos when one is hovered
            if (hoveredVideoRef.current !== null) {
              scaleMultiplier *= 0.7;
            }
          }

          // Parallax movement (disabled when moving toward center)
          let parallaxX = 0;
          let parallaxY = 0;
          
          if (hoveredVideoRef.current !== videos[index]?.id) {
            const parallaxStrength = 30 + index * 10;
            const depthRatio = Math.max(0.2, 1 - distance / maxDimension);
            
            parallaxX = -parallaxStrength * mousePos.current.relX * depthRatio;
            parallaxY = -parallaxStrength * mousePos.current.relY * depthRatio;
          }
          
          // Combine parallax and center movement
          const finalX = parallaxX + moveTowardCenter.x;
          const finalY = parallaxY + moveTowardCenter.y;

          // Z-index for focus effect
          let zIndex = 1;
          
          if (hoveredVideoRef.current === videos[index]?.id) {
            zIndex = 100;
          }

          // Apply animations (including parallax scroll offset)
          gsap.to(el, {
            x: finalX,
            y: finalY + scrollOffset.current,
            scale: scaleMultiplier,
            rotation: mousePos.current.relX * (10 + index * 3),
            zIndex: zIndex,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });

      // Title parallax (mouse movement only, no scroll offset)
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          x: mousePos.current.relX * -50,
          y: mousePos.current.relY * -30,
          duration: 1,
          ease: "power2.out"
        });
      }

      requestAnimationFrame(animateElements);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animateElements();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-screen overflow-x-hidden cursor-none" style={{ height: 'auto', minHeight: '100vh' }}>
      {/* First Section - Video Gallery */}
      <div ref={containerRef} className="relative w-screen h-screen bg-[#FFF3E6]">
        {/* Video Elements */}
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={el => {
              if (el) elementsRef.current[index] = el;
            }}
            className="absolute rounded-2xl pointer-events-auto overflow-hidden cursor-pointer group"
            style={{
              width: `${video.size}px`,
              height: `${video.size}px`,
              left: `${video.x}%`,
              top: `${video.y}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={() => handleVideoHover(video.id, true)}
            onMouseLeave={() => handleVideoHover(video.id, false)}
            onClick={() => handleVideoClick(video.id)}
          >
            {/* Thumbnail Image */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to colored background if thumbnail fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            
            {/* Fallback colored background */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: video.color, display: 'none' }}
            />
            
            {/* Video Element (plays on hover) */}
            <video
              ref={el => {
                if (el) videoRefs.current[index] = el;
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={video.videoUrl} type="video/mp4" />
            </video>
          </div>
        ))}

        {/* Title */}
        <div 
          ref={titleRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        >
          <h1 className="text-5xl font-black text-black tracking-wider text-center" style={{ fontFamily: 'var(--font-style-script), cursive' }}>
            SAY SOMETHING
          </h1>
        </div>

        {/* Custom cursor */}
        <div 
          ref={cursorRef}
          className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
            isHoveringContent 
              ? 'bg-white rounded-lg w-[40px] flex justify-center shadow-lg' 
              : `w-5 h-5 bg-black/50 rounded-full ${isHovering ? 'scale-150 bg-black/80' : ''}`
          }`}
          style={{ 
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-smooch-sans), system-ui, -apple-system, sans-serif'
          }}
        >
          {isHoveringContent && (
            <span className="text-sm font-medium text-black whitespace-nowrap">
              click
            </span>
          )}
        </div>
      </div>

      {/* Second Section - Posts */}
      <div className="relative w-full bg-[#FFF3E6] py-16">
        <div className="mx-auto px-8">
          {/* Create Post Section */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4" style={{ padding: '16px 24px', marginBottom: '16px' }}>
              <span className="text-lg font-medium text-gray-700">Say something about Pst. Tru South</span>
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={handleCreatePostClick}
                  className="bg-black text-white rounded-sm flex items-center justify-center hover:bg-gray-800 transition-all duration-200 text-xl font-light hover:scale-105 shadow-md"
                  style={{ width: '44px', height: '44px', padding: '8px' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          {/* Series of Double components */}
          <div className="space-y-8">
            <Double projects={[postsData[0][0], postsData[0][1]]} onContentHover={setIsHoveringContent} />
            <Double projects={[postsData[1][0], postsData[1][1]]} reversed={true} onContentHover={setIsHoveringContent} />
            <Double projects={[postsData[2][0], postsData[2][1]]} onContentHover={setIsHoveringContent} />
            <Double projects={[postsData[3][0], postsData[3][1]]} reversed={true} onContentHover={setIsHoveringContent} />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showPostOptions && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPostOptions(false);
              }
            }}
          >
            <motion.div 
              className="rounded-2xl max-w-lg w-full mx-4 shadow-2xl"
              initial={{ 
                scale: buttonPosition.width / 400, // Start at button size relative to modal width
                opacity: 1,
                x: buttonPosition.x - window.innerWidth / 2,
                y: buttonPosition.y - window.innerHeight / 2,
                borderRadius: '50%'
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                x: 0, 
                y: 0,
                borderRadius: '16px'
              }}
              exit={{ 
                scale: buttonPosition.width / 400,
                opacity: 1,
                x: buttonPosition.x - window.innerWidth / 2,
                y: buttonPosition.y - window.innerHeight / 2,
                borderRadius: '50%'
              }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 35,
                duration: 0.4
              }}
              style={{ 
                backgroundColor: '#FFFDFA',
                fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                padding: '40px'
              }}
            >
            <motion.div 
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h3 
                className="text-3xl font-bold text-black"
                style={{ fontFamily: 'var(--font-style-script), cursive' }}
              >
                Create New Post
              </h3>
              <button
                onClick={() => setShowPostOptions(false)}
                className="text-gray-400 hover:text-black text-3xl font-light transition-colors duration-200 w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </motion.div>
            
            <motion.p 
              className="text-xs text-gray-700 mb-10" 
              style={{ fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif', marginBottom: '14px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              Choose the type of content you'd like to share:
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.35, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Video post selected');
                  setShowPostOptions(false);
                }}
                className="flex flex-col items-center rounded-md"
                style={{ 
                  backgroundColor: '#FFF3E6',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                  padding: '32px 24px'
                }}
              >
                <Image
                  src="/icons/video.svg"
                  alt="Video"
                  width={48}
                  height={48}
                  className="mb-4 group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-semibold text-lg text-gray-700 group-hover:text-black">Video</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Picture post selected');
                  setShowPostOptions(false);
                }}
                className="flex flex-col items-center rounded-md"
                style={{ 
                  backgroundColor: '#FFF3E6',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                  padding: '32px 24px'
                }}
              >
                <Image
                  src="/icons/image.svg"
                  alt="Picture"
                  width={48}
                  height={48}
                  className="mb-4 group-hover:scale-110 transition-transform duration-100"
                />
                <span className="font-semibold text-lg text-gray-700 group-hover:text-black">Picture</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Audio post selected');
                  setShowPostOptions(false);
                }}
                className="flex flex-col items-center rounded-md"
                style={{ 
                  backgroundColor: '#FFF3E6',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                  padding: '32px 24px'
                }}
              >
                <Image
                  src="/icons/audio.svg"
                  alt="Audio"
                  width={48}
                  height={48}
                  className="mb-4 group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-semibold text-lg text-gray-700 group-hover:text-black">Audio</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Text post selected');
                  setShowPostOptions(false);
                }}
                className="flex flex-col items-center rounded-md"
                style={{ 
                  backgroundColor: '#FFF3E6',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                  padding: '32px 24px'
                }}
              >
                <Image
                  src="/icons/text.svg"
                  alt="Text"
                  width={48}
                  height={48}
                  className="mb-4 group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-semibold text-lg text-gray-700 group-hover:text-black">Text</span>
              </motion.button>
            </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Video Controls */}
      {fullscreenVideo && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black">
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 text-white text-2xl hover:text-gray-300 z-[1002]"
          >
            ✕
          </button>
          <video
            className="w-full h-full object-contain"
            controls
            autoPlay
            src={videos.find(v => v.id === fullscreenVideo)?.videoUrl}
          />
        </div>
      )}
    </div>
  );
};

export default PostPage;