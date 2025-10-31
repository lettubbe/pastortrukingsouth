'use client';

import React, { createContext, useContext } from 'react';
import AudioControl from '../components/AudioControl';
import { useBackgroundAudio } from '../hooks/useBackgroundAudio';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  hasUserInteracted: boolean;
  toggleMute: () => void;
  pauseTemporarily: () => void;
  resumeAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  // Use the original working background audio hook
  const { 
    isPlaying, 
    isMuted, 
    hasUserInteracted, 
    toggleMute, 
    pauseTemporarily, 
    resumeAudio 
  } = useBackgroundAudio();

  const contextValue: AudioContextType = {
    isPlaying,
    isMuted,
    hasUserInteracted,
    toggleMute,
    pauseTemporarily,
    resumeAudio,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      {/* Global Audio Control */}
      <AudioControl 
        isMuted={isMuted}
        hasUserInteracted={hasUserInteracted}
        toggleMute={toggleMute}
        pageAnimationStarted={hasUserInteracted}
      />
    </AudioContext.Provider>
  );
};