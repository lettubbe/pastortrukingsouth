'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AudioControlProps {
  isMuted: boolean;
  toggleMute: () => void;
  hasUserInteracted: boolean;
  pageAnimationStarted: boolean;
}

const AudioControl: React.FC<AudioControlProps> = ({
  isMuted,
  toggleMute,
  hasUserInteracted,
  pageAnimationStarted
}) => {

  return (
    <motion.button
      onClick={toggleMute}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: hasUserInteracted ? 1 : 0.7,
        scale: 1
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        zIndex: 99999,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      aria-label={isMuted ? 'Unmute background audio' : 'Mute background audio'}
    >
      {isMuted ? (
        // Muted icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      ) : (
        // Unmuted icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      )}

      {/* Pulse animation when playing */}
      {!isMuted && hasUserInteracted && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.button>
  );
};

export default AudioControl;