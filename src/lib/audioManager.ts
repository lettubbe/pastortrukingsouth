// Singleton audio manager that persists across page navigation
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = true;
  private hasUserInteracted = false;
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  private constructor() {
    // Initialize immediately if in browser
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => this.initializeAudio(), 0);
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeAudio() {
    if (this.isInitialized) {
      console.log('Audio manager already initialized');
      return;
    }

    console.log('Initializing singleton audio manager');
    this.audio = new Audio('/audio/backgroundSound.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.3;
    this.audio.preload = 'auto';
    this.isInitialized = true;

    // Add event listeners
    this.audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    this.audio.addEventListener('loadstart', () => {
      console.log('Audio loading started');
    });

    this.audio.addEventListener('canplaythrough', () => {
      console.log('Audio can play through');
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
      console.log('Audio started playing');
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
      console.log('Audio paused');
    });

    // Listen for user interaction globally
    const handleUserInteraction = () => {
      if (!this.hasUserInteracted) {
        console.log('User interaction detected in audio manager');
        this.hasUserInteracted = true;
        this.notifyListeners();
        this.startAudio();
      }
    };

    // Add global interaction listeners
    document.addEventListener('click', handleUserInteraction, { once: false });
    document.addEventListener('keydown', handleUserInteraction, { once: false });
    document.addEventListener('touchstart', handleUserInteraction, { once: false });

    // Handle Next.js router events to prevent audio interruption
    this.setupRouterEventHandling();
  }

  private setupRouterEventHandling() {
    // Prevent audio interruption during page navigation
    if (typeof window !== 'undefined') {
      // Listen for beforeunload to maintain audio state
      window.addEventListener('beforeunload', () => {
        console.log('Page unloading, preserving audio state');
      });

      // Listen for page show/hide events
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.hasUserInteracted && !this.isMuted) {
          // Resume audio when page becomes visible again
          setTimeout(() => this.resumeAudio(), 100);
        }
      });

      // Handle browser back/forward navigation
      window.addEventListener('popstate', () => {
        console.log('Navigation detected, maintaining audio');
        if (this.hasUserInteracted && !this.isMuted) {
          setTimeout(() => this.resumeAudio(), 500);
        }
      });
    }
  }

  // Subscribe to state changes
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  async startAudio() {
    if (this.audio && !this.isMuted && this.hasUserInteracted) {
      try {
        console.log('Starting singleton audio...');
        await this.audio.play();
      } catch (error) {
        console.log('Singleton audio play failed:', error);
      }
    }
  }

  pauseAudio() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
    }
  }

  async resumeAudio() {
    if (this.audio && !this.isMuted && this.hasUserInteracted) {
      try {
        await this.audio.play();
      } catch (error) {
        console.log('Singleton audio resume failed:', error);
      }
    }
  }

  pauseTemporarily() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      console.log('Singleton audio paused temporarily');
    }
  }

  async toggleMute() {
    console.log('Singleton toggle mute, current state:', this.isMuted);
    
    if (this.isMuted) {
      // Unmute
      this.isMuted = false;
      this.hasUserInteracted = true;
      this.notifyListeners();
      await this.startAudio();
    } else {
      // Mute
      this.isMuted = true;
      this.notifyListeners();
      this.pauseAudio();
    }
  }

  // Getters for current state
  getIsPlaying() {
    return this.isPlaying;
  }

  getIsMuted() {
    return this.isMuted;
  }

  getHasUserInteracted() {
    return this.hasUserInteracted;
  }
}

export const audioManager = AudioManager.getInstance();