"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { Double } from './Double';
import { PostCreationForm } from './PostCreationForm';
import { PostsSkeleton, EmptyPosts } from './PostsSkeleton';
import { 
  usePostsQuery, 
  useAllPosts, 
  transformPostToProject 
} from '@/hooks/usePostsQuery';
import Image from 'next/image';
import Navbar from './Navbar';
import Preloader from './Preloader';
import { pageSwing, pageEntrance } from '../animations/pageAnimations';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAudioContext } from '../providers/AudioProvider';

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

type PostType = 'video' | 'photo' | 'audio' | 'text';

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
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<PostType>('text');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 44, height: 44 });
  const [isHoveringContent, setIsHoveringContent] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState<{[key: number]: string}>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Preloader and page animation state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [pageAnimationStarted, setPageAnimationStarted] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('50% 50vh');
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Background audio from global context
  const { pauseTemporarily, resumeAudio } = useAudioContext();
  
  
  // hooks for posts data
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage,
    refetch
  } = usePostsQuery({ limit: 10, sortBy: 'newest' });
  
  const serverPosts = useAllPosts({ limit: 10, sortBy: 'newest' });
  
  // Create S3 posts from videos (without duplicates from the video gallery)
  const s3Posts = [
    {
      _id: 'wife-testimony',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Ms.+UpgradeMain%5Bwife%5D.mp4',
      thumbnail: '/images/thumbnails/wife.png',
      caption: 'Wife',
      authorName: 'Ms. Upgrade',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'wife-kids-testimony',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/wife%26kids.mp4',
      thumbnail: '/images/thumbnails/wife&kids.png',
      caption: 'Wife & Kids',
      authorName: 'Ms. Upgrade | Levi | Haven',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'pastor-israel-testimony',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Pastor+Israel+Atima+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Pst Isreal.png',
      caption: 'Pastor Israel',
      authorName: 'Pastor Israel',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'tb1-testimony',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/TB1.mov',
      thumbnail: '/images/thumbnails/TB1.png',
      caption: 'TB1',
      authorName: 'TB1',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'protek-testimony',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Protek.mp4',
      thumbnail: '/images/thumbnails/Protek.png',
      caption: 'Protek',
      authorName: 'Protek',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'peddygree-testimony',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Peddygree.mov',
      thumbnail: '/images/thumbnails/Peddygree.png',
      caption: 'Peddygree',
      authorName: 'Peddygree',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    }
  ];
  
  //  "thoughts" posts
  const thoughtsPosts = [    
    {
      _id: 'sis-esther-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Esther+Atima+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/EstherAtima.png',
      caption: 'Sis Esther Atima',
      authorName: 'Sis Esther Atima',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-adrian-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Adrian+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Adrian.png',
      caption: 'Bro Adrian',
      authorName: 'Bro Adrian',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-alex-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Alex+Obilor+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Alex Obilor.png',
      caption: 'Bro Alex Obilor',
      authorName: 'Bro Alex Obilor',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-augustine-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Augustine+Duru+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Augustine.png',
      caption: 'Bro Augustine Duru',
      authorName: 'Bro Augustine Duru',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-dominion-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Dominion+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Dominion.png',
      caption: 'Bro Dominion',
      authorName: 'Bro Dominion',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-rj-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+RJ+Ozioma+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/RJ Ozioma.png',
      caption: 'Bro RJ Ozioma',
      authorName: 'Bro RJ Ozioma',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-ekene-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Ekene+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Ekene.png',
      caption: 'Bro Ekene',
      authorName: 'Bro Ekene',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-francis-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Francis+Ugochukwu+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Fransis Ugochukwu.png',
      caption: 'Bro Francis Ugochukwu',
      authorName: 'Bro Francis Ugochukwu',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-nolly-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Nolly+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Nolly.png',
      caption: 'Bro Nolly',
      authorName: 'Bro Nolly',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-onyedi-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Onyedi+Richard+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/onyediRichard.png',
      caption: 'Bro Onyedi Richard',
      authorName: 'Bro Onyedi Richard',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-samuel-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Samuel+Yaqub-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Samuel Yaqub.png',
      caption: 'Bro Samuel Yaqub',
      authorName: 'Bro Samuel Yaqub',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-victor-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Victor+Daniel+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Victor Daniel.png',
      caption: 'Bro Victor Daniel',
      authorName: 'Bro Victor Daniel',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'bro-wisdom-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Wisdom+Saint-Charles+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Wisdom Saint-Charles.png',
      caption: 'Bro Wisdom Saint-Charles',
      authorName: 'Bro Wisdom Saint-Charles',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'sis-adora-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Adora+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Adora.png',
      caption: 'Sis Adora',
      authorName: 'Sis Adora',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'sis-ver-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Ver+Elechi+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Ver Elechi.png',
      caption: 'Sis Ver Elechi',
      authorName: 'Sis Ver Elechi',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'sis-winifred-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Winifred+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/Winifred.png',
      caption: 'Sis Winifred',
      authorName: 'Sis Winifred',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    },
    {
      _id: 'sisi-mirabelle-thoughts',
      type: 'video' as const,
      mediaUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sisi+Mirabelle+Macanson+-+HBD+P.TSK.mp4',
      thumbnail: '/images/thumbnails/MirabelleMacanson.png',
      caption: 'Sisi Mirabelle Macanson',
      authorName: 'Sisi Mirabelle Macanson',
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved' as const
    }
  ];
  
  // Combine all posts: S3 posts first, then thoughts posts, then server posts
  const posts = [...s3Posts, ...thoughtsPosts, ...serverPosts];
  
  // Debug logging
  console.log('Posts data:', { posts, isLoading, isError, data });


  const handlePreloaderComplete = () => {
    setPageAnimationStarted(true);
    setTimeout(() => setShowPreloader(false), 1200); // Hide preloader after animation
  };

  // Prevent scrolling during preloader
  useEffect(() => {
    if (!showPreloader) {
      // Remove loading class when preloader is done
      document.body.classList.remove('loading');
    }
  }, [showPreloader]);

  const handleMenuToggle = (menuState: boolean) => {
    if (menuState) {
      // Capture current viewport center in page coordinates
      const scrollY = window.scrollY;
      const viewportCenterY = scrollY + (window.innerHeight / 2);
      setTransformOrigin(`50% ${viewportCenterY}px`);
    }
    setIsMenuOpen(menuState);
  };

  useEffect(() => {
    // Only initialize Lenis after preloader is done
    if (!showPreloader) {
      const lenis = new Lenis();

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }

    // Scroll to top on load
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {};
  }, [showPreloader]);

  const videos: VideoElement[] = [
    { id: 1, title: "Wife", thumbnail: '/images/thumbnails/wife.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Ms.+UpgradeMain%5Bwife%5D.mp4', x: 15, y: 20, size: 120, color: '#ff6b6b' },
    { id: 2, title: "Wife&Kids", thumbnail: '/images/thumbnails/wife&kids.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/wife%26kids.mp4', x: 85, y: 25, size: 100, color: '#4ecdc4' },
    { id: 3, title: "Brother", thumbnail: '/images/thumbnails/Pst Isreal.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Pastor+Israel+Atima+-+HBD+P.TSK.mp4', x: 10, y: 75, size: 140, color: '#45b7d1' },
    { id: 4, title: "TB1", thumbnail: '/images/thumbnails/TB1.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/TB1.mov', x: 90, y: 80, size: 110, color: '#96ceb4' },
    { id: 5, title: "Protek", thumbnail: '/images/thumbnails/Protek.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Protek.mp4', x: 75, y: 10, size: 130, color: '#ffeaa7' },
    { id: 6, title: "Peddygree", thumbnail: '/images/thumbnails/Peddygree.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Peddygree.mov', x: 80, y: 60, size: 90, color: '#fd79a8' },
    { id: 7, title: "Bro Adrian", thumbnail: '/images/thumbnails/Adrian.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Bro+Adrian+-+HBD+P.TSK.mp4', x: 30, y: 90, size: 80, color: '#a29bfe' },
    { id: 8, title: "Sis Esther Atima", thumbnail: '/images/thumbnails/EstherAtima.png', videoUrl: 'https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Esther+Atima+-+HBD+P.TSK.mp4', x: 20, y: 45, size: 160, color: '#fd7f28' }
  ];

  // Convert posts to pairs for Double components
  const getPostPairs = () => {
    const filteredPosts = posts.filter(post => post && post.type);
    const transformedPosts = filteredPosts.map(transformPostToProject);
    const pairs = [];
    for (let i = 0; i < transformedPosts.length; i += 2) {
      pairs.push([
        transformedPosts[i],
        transformedPosts[i + 1] || null
      ].filter(Boolean));
    }
    console.log('Post pairs:', pairs);
    return pairs;
  };

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
    // Pause background audio when entering fullscreen
    pauseTemporarily();
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
    
    // Resume background audio when exiting fullscreen
    resumeAudio();
    
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
    <div style={{ position: 'relative' }}>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} isExiting={pageAnimationStarted} text="Say Something" />}

      <motion.div
        variants={pageEntrance}
        initial="initial"
        animate={pageAnimationStarted ? "animate" : "initial"}
        custom={isMobile}
        style={{
          position: 'relative',
          backgroundColor: 'transparent',
          zIndex: pageAnimationStarted ? 10000 : 1,
          transformOrigin: 'top left'
        }}
      >
        <Navbar onMenuToggle={handleMenuToggle} pageAnimationStarted={pageAnimationStarted} forceBlackText={true} />

        <motion.div
          variants={pageSwing}
          animate="animate"
          custom={isMenuOpen}
          style={{
            width: '100%',
            transformOrigin: transformOrigin
          }}
        >
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
              <source src={video.videoUrl} type="video/quicktime" />
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
              <div className="relative flex gap-2">
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
          
          {/* Dynamic Posts Content */}
          {isLoading ? (
            <PostsSkeleton count={4} />
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto',
                  backgroundColor: '#fef2f2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <svg style={{ width: '32px', height: '32px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Connection Error
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px',
                  maxWidth: '400px',
                  margin: '0 auto 24px auto'
                }}>
                  {error?.message || 'Failed to load posts'}
                </p>
              </div>
              <button 
                onClick={() => refetch()}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <EmptyPosts onCreatePost={handleCreatePostClick} />
          ) : (
            <div className="space-y-8">
              {getPostPairs().map((pair, index) => (
                <Double 
                  key={`pair-${index}`}
                  projects={pair} 
                  reversed={index % 2 === 1} 
                  onContentHover={setIsHoveringContent}
                  onAudioPause={pauseTemporarily}
                  onAudioResume={resumeAudio}
                />
              ))}
              
              {/* Load More Button */}
              {hasNextPage && (
                <div className="text-center pt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
                  </button>
                </div>
              )}
            </div>
          )}
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
                  setSelectedPostType('video');
                  setShowPostOptions(false);
                  setShowPostForm(true);
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
                  setSelectedPostType('photo');
                  setShowPostOptions(false);
                  setShowPostForm(true);
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
                  setSelectedPostType('audio');
                  setShowPostOptions(false);
                  setShowPostForm(true);
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
                  setSelectedPostType('text');
                  setShowPostOptions(false);
                  setShowPostForm(true);
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

      {/* Post Creation Form */}
      <PostCreationForm
        isOpen={showPostForm}
        onClose={() => setShowPostForm(false)}
        postType={selectedPostType}
        buttonPosition={buttonPosition}
        onPostCreated={() => {
          refetch();
          setShowPostForm(false);
        }}
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PostPage;