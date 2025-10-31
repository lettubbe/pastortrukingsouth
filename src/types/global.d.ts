declare global {
  interface Window {
    globalAudio?: HTMLAudioElement;
    globalAudioState?: {
      isPlaying: boolean;
      isMuted: boolean;
      hasUserInteracted: boolean;
    };
    globalAudioListeners?: Set<() => void>;
    notifyGlobalAudioListeners?: () => void;
    handleGlobalInteraction?: () => void;
    startGlobalAudio?: () => Promise<void>;
    pauseGlobalAudio?: () => void;
    resumeGlobalAudio?: () => Promise<void>;
    pauseGlobalAudioTemporarily?: () => void;
    toggleGlobalAudioMute?: () => Promise<void>;
    subscribeToGlobalAudio?: (callback: () => void) => () => void;
  }
}

export {};