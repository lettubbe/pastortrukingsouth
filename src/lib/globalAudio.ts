// Global audio that persists completely outside React lifecycle
let globalAudio: HTMLAudioElement | null = null;
let isGlobalAudioInitialized = false;
let globalAudioState = {
  isPlaying: false,
  isMuted: true,
  hasUserInteracted: false
};

const globalListeners = new Set<() => void>();

// Initialize audio immediately when module loads (in browser)
if (typeof window !== 'undefined') {
  initializeGlobalAudio();
}

function initializeGlobalAudio() {
  if (isGlobalAudioInitialized) {
    console.log('Global audio already initialized');
    return;
  }

  console.log('Creating global audio element');
  globalAudio = new Audio('/audio/backgroundSound.mp3');
  globalAudio.loop = true;
  globalAudio.volume = 0.3;
  globalAudio.preload = 'auto';
  isGlobalAudioInitialized = true;

  // Event listeners
  globalAudio.addEventListener('play', () => {
    globalAudioState.isPlaying = true;
    notifyGlobalListeners();
    console.log('Global audio playing');
  });

  globalAudio.addEventListener('pause', () => {
    globalAudioState.isPlaying = false;
    notifyGlobalListeners();
    console.log('Global audio paused');
  });

  globalAudio.addEventListener('error', (e) => {
    console.error('Global audio error:', e);
  });

  // Global user interaction detection
  const handleGlobalInteraction = () => {
    if (!globalAudioState.hasUserInteracted) {
      console.log('Global user interaction detected');
      globalAudioState.hasUserInteracted = true;
      notifyGlobalListeners();
      if (!globalAudioState.isMuted) {
        startGlobalAudio();
      }
    }
  };

  // Add global listeners that persist across navigation
  document.addEventListener('click', handleGlobalInteraction);
  document.addEventListener('keydown', handleGlobalInteraction);
  document.addEventListener('touchstart', handleGlobalInteraction);

  // Handle visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && 
        globalAudioState.hasUserInteracted && 
        !globalAudioState.isMuted &&
        !globalAudioState.isPlaying) {
      setTimeout(() => {
        console.log('Page became visible, resuming audio');
        startGlobalAudio();
      }, 100);
    }
  });

  console.log('Global audio initialized successfully');
}

function notifyGlobalListeners() {
  globalListeners.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Error in global audio listener:', error);
    }
  });
}

async function startGlobalAudio() {
  if (globalAudio && !globalAudioState.isMuted && globalAudioState.hasUserInteracted) {
    try {
      await globalAudio.play();
      console.log('Global audio started successfully');
    } catch (error) {
      console.log('Global audio play failed:', error);
    }
  }
}

function pauseGlobalAudio() {
  if (globalAudio && globalAudioState.isPlaying) {
    globalAudio.pause();
    console.log('Global audio paused');
  }
}

async function resumeGlobalAudio() {
  if (globalAudio && !globalAudioState.isMuted && globalAudioState.hasUserInteracted) {
    try {
      await globalAudio.play();
      console.log('Global audio resumed');
    } catch (error) {
      console.log('Global audio resume failed:', error);
    }
  }
}

function pauseGlobalAudioTemporarily() {
  if (globalAudio && globalAudioState.isPlaying) {
    globalAudio.pause();
    console.log('Global audio paused temporarily');
  }
}

async function toggleGlobalAudioMute() {
  console.log('Toggle global audio mute, current state:', globalAudioState.isMuted);
  
  if (globalAudioState.isMuted) {
    // Unmute
    globalAudioState.isMuted = false;
    globalAudioState.hasUserInteracted = true;
    notifyGlobalListeners();
    await startGlobalAudio();
  } else {
    // Mute
    globalAudioState.isMuted = true;
    notifyGlobalListeners();
    pauseGlobalAudio();
  }
}

function subscribeToGlobalAudio(callback: () => void): () => void {
  globalListeners.add(callback);
  return () => {
    globalListeners.delete(callback);
  };
}

function getGlobalAudioState() {
  return { ...globalAudioState };
}

// Export the global audio interface
export {
  subscribeToGlobalAudio,
  getGlobalAudioState,
  toggleGlobalAudioMute,
  pauseGlobalAudioTemporarily,
  resumeGlobalAudio,
  startGlobalAudio
};