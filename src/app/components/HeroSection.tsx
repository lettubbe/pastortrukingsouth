import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { AnimatedChars, FadeText } from './TextAnimations';

interface HeroSectionProps {
  pageAnimationStarted: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ pageAnimationStarted }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [backgroundParallax, setBackgroundParallax] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = heroRef.current;
      if (!heroElement) return;

      const heroRect = heroElement.getBoundingClientRect();
      const heroHeight = heroElement.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress based on element visibility
      const scrollY = window.scrollY;
      const elementTop = heroElement.offsetTop;
      const elementHeight = heroElement.offsetHeight;
      
      // Start animation immediately when scrolling begins
      const startScroll = 0; // Start from the very beginning of scroll
      const endScroll = 200; // Finish after scrolling just 200px
      const scrollRange = endScroll - startScroll;
      
      const progress = scrollRange > 0 ? Math.min(Math.max((scrollY - startScroll) / scrollRange, 0), 1) : 0;
      
      // Calculate background parallax for when hero is scrolling out of view
      const heroBottom = elementTop + elementHeight;
      const parallaxStart = heroBottom - windowHeight; // Start when hero bottom reaches viewport bottom
      const parallaxEnd = parallaxStart + windowHeight * 2; // Continue for 2 viewport heights
      const parallaxRange = parallaxEnd - parallaxStart;
      
      const backgroundProgress = parallaxRange > 0 ? Math.min(Math.max((scrollY - parallaxStart) / parallaxRange, 0), 1) : 0;
      
      setScrollProgress(progress);
      setBackgroundParallax(backgroundProgress);
    };

    // Use native scroll event for smooth scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      style={{
        height: '160vh', // room to scroll
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Fixed Background Layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backgroundBlendMode: 'overlay',
          transform: `scale(${1 + (scrollProgress * 0.2)}) translateY(${backgroundParallax * -70}vh)`,
          transformOrigin: 'center center',
          zIndex: -1
        }}
      />
      
      {/* Scrolling Text Container */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(20px, 5%, 5%)',
          right: 'clamp(20px, 5%, 5%)',
          top: 'clamp(45vh, 50vh, 45vh)', // Start positioned below viewport
          height: 'auto',
          transform: `translateY(${-scrollProgress * 20}vh)`, // Move up as user scrolls
          zIndex: 1
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'clamp(300px, 90%, 480px)',
            paddingBottom: '150px'
          }}
        >
          {/* Small text */}
          <p style={{
            fontSize: 'clamp(18px, 4vw, 18px)',
            fontWeight: '400',
            color: 'white',
            lineHeight: '1.6',
            margin: 0,
            marginBottom: 'clamp(45px, 3vw, 15px)',
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            overflow: 'hidden'
          }}>
            <FadeText 
              text="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim."
              pageAnimationStarted={pageAnimationStarted}
              scrollProgress={scrollProgress}
              fadeOnScroll={true}
            />
          </p>

          {/* Bold hero text */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: 'clamp(80px, 6vw, 40px)'
          }}>
            <h1 style={{
              fontSize: 'clamp(28px, 12vw, 56px)',
              fontWeight: '500',
              color: 'white',
              margin: 0,
              lineHeight: '0.9',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              overflow: 'hidden'
            }}>
              <AnimatedChars 
                word="Lorem"
                pageAnimationStarted={pageAnimationStarted}
                scrollProgress={scrollProgress}
              />
            </h1>
            <h1 style={{
              fontSize: 'clamp(28px, 12vw, 56px)',
              fontWeight: '500',
              color: 'white',
              margin: 0,
              lineHeight: '0.9',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              overflow: 'hidden'
            }}>
              <AnimatedChars 
                word="ipsum"
                pageAnimationStarted={pageAnimationStarted}
                scrollProgress={scrollProgress}
              />
            </h1>
            <h1 style={{
              fontSize: 'clamp(28px, 12vw, 56px)',
              fontWeight: '500',
              color: 'white',
              margin: 0,
              lineHeight: '0.9',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              overflow: 'hidden'
            }}>
              <AnimatedChars 
                word="consectetur"
                pageAnimationStarted={pageAnimationStarted}
                scrollProgress={scrollProgress}
              />
            </h1>
          </div>

          {/* Small text */}
          <p style={{
            fontSize: 'clamp(18px, 4vw, 18px)',
            fontWeight: '400',
            color: 'white',
            lineHeight: '1.6',
            margin: 0,
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            overflow: 'hidden'
          }}>
            <FadeText 
              text="Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
              pageAnimationStarted={pageAnimationStarted}
              scrollProgress={scrollProgress}
              fadeOnScroll={false}
              startDelay={0.4}
            />
          </p>
        </div>
      </div>
    </motion.div>
  );
};