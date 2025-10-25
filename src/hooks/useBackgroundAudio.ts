'use client';

import { useState, useEffect, useRef } from 'react';

export const useBackgroundAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    console.log('Creating audio element for backgroundSound.mp3');
    audioRef.current = new Audio('/audio/backgroundSound.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // reasonable volume level

    // Add error event listener
    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    audioRef.current.addEventListener('loadstart', () => {
      console.log('Audio loading started');
    });

    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Audio can play through');
    });

    // Listen for user interaction to enable audio
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        console.log('User interaction detected, enabling audio');
        setHasUserInteracted(true);
        startAudio();
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []); // Remove hasUserInteracted from dependencies to prevent recreation

  const startAudio = async () => {
    if (audioRef.current && !isMuted) {
      try {
        console.log('Attempting to start audio...');
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Audio started successfully');
      } catch (error) {
        console.log('Audio play failed:', error);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = async () => {
    if (audioRef.current && !isMuted && hasUserInteracted) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Background audio resumed');
      } catch (error) {
        console.log('Background audio resume failed:', error);
      }
    }
  };

  const pauseTemporarily = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('Background audio paused temporarily');
    }
  };

  const toggleMute = async () => {
    console.log('Toggle mute clicked, current state:', isMuted);
    console.log('Audio ref exists:', !!audioRef.current);
    if (audioRef.current) {
      if (isMuted) {
        // Unmute
        console.log('Unmuting and starting audio...');
        setIsMuted(false);
        setHasUserInteracted(true);

        // Call startAudio directly here with the current audio ref
        try {
          console.log('Attempting to start audio directly...');
          await audioRef.current.play();
          setIsPlaying(true);
          console.log('Audio started successfully');
        } catch (error) {
          console.log('Audio play failed:', error);
        }
      } else {
        // Mute
        console.log('Muting audio...');
        setIsMuted(true);
        pauseAudio();
      }
    } else {
      console.log('Audio ref is null!');
    }
  };

  return {
    isPlaying,
    isMuted,
    hasUserInteracted,
    toggleMute,
    startAudio,
    pauseAudio,
    resumeAudio,
    pauseTemporarily
  };
};