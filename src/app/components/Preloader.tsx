'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const shimmerAnimation = {
  initial: { 
    backgroundPosition: '200% 0'
  },
  animate: { 
    backgroundPosition: '-200% 0',
    transition: {
      duration: 3,
      ease: 'easeInOut' as any,
      repeat: Infinity
    }
  }
};

const preloaderExit = {
  initial: { 
    opacity: 1
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 1.2,
      ease: [0.6, 0, 0.4, 1] as any
    }
  }
};

const textScaleDown = {
  initial: {
    scale: 1
  },
  exit: {
    scale: 0.3,
    transition: {
      duration: 1.2,
      ease: [0.6, 0, 0.4, 1] as any
    }
  }
};

interface PreloaderProps {
  onComplete: () => void;
  isExiting?: boolean;
}

export default function Preloader({ onComplete, isExiting = false }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldScale, setShouldScale] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Start page animation immediately after 2 seconds
      setTimeout(() => setShouldScale(true), 300); // Start scale after 300ms
      setTimeout(() => setIsLoading(false), 1300); // Hide preloader after animations
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={preloaderExit}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <motion.h1
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
              scale: shouldScale ? 0.3 : 1
            }}
            transition={{
              backgroundPosition: {
                duration: 3,
                ease: 'easeInOut' as any,
                repeat: Infinity
              },
              scale: {
                duration: 1.0,
                ease: [0.6, 0, 0.4, 1] as any
              }
            }}
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'transparent',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              background: 'linear-gradient(90deg, #333 25%, #fff 50%, #333 75%)',
              backgroundSize: '200% 100%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              margin: 0
            }}
          >
            Tru South King
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}