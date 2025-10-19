"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

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
  const hoveredVideoRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [fullscreenVideo, setFullscreenVideo] = useState<number | null>(null);

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
            // Proximity-based scaling for non-hovered videos
            if (distance < proximityRadius) {
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

          // Apply animations
          gsap.to(el, {
            x: finalX,
            y: finalY,
            scale: scaleMultiplier,
            rotation: mousePos.current.relX * (10 + index * 3),
            zIndex: zIndex,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });

      // Title parallax
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
    animateElements();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden cursor-none">
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
        <h1 className="text-5xl font-black text-gray-800 tracking-wider text-center">
          SAY SOMETHING
        </h1>
      </div>

      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className={`fixed w-5 h-5 bg-black/50 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out ${
          isHovering ? 'scale-150 bg-black/80' : ''
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      />

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