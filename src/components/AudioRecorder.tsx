import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onClose,
  isOpen
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const durationRef = useRef<number>(0);

  // Format duration display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start audio level monitoring
  const startAudioLevelMonitoring = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (err) {
      console.warn('Audio level monitoring not available:', err);
    }
  }, [isRecording]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm; codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Use the ref value which has the accurate duration
        const finalDuration = durationRef.current;
        
        setRecordedAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: finalDuration
        });
        setIsProcessing(false);
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setDuration(0);
      durationRef.current = 0;
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
      }, 1000);
      
      // Start audio level monitoring
      startAudioLevelMonitoring(stream);
      
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
      console.error('Error accessing microphone:', err);
    }
  }, [duration, onRecordingComplete, startAudioLevelMonitoring]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Clean up timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Clean up audio monitoring
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  // Pause/Resume recording
  const togglePauseRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (intervalRef.current === null) {
          intervalRef.current = setInterval(() => {
            durationRef.current += 1;
            setDuration(durationRef.current);
          }, 1000);
        }
      } else {
        mediaRecorderRef.current.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      setIsPaused(!isPaused);
    }
  }, [isPaused]);

  // Play recorded audio
  const playRecordedAudio = useCallback(() => {
    if (recordedAudio && audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
      
      // Start playback timer
      playbackIntervalRef.current = setInterval(() => {
        if (audioPlayerRef.current) {
          const currentTime = Math.floor(audioPlayerRef.current.currentTime);
          setPlaybackTime(currentTime);
        }
      }, 100); // Update every 100ms for smooth countdown
    }
  }, [recordedAudio]);

  // Pause recorded audio
  const pauseRecordedAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
      
      // Stop playback timer
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }
  }, []);

  // Submit recorded audio
  const submitRecording = useCallback(() => {
    if (recordedAudio) {
      onRecordingComplete(recordedAudio.blob, recordedAudio.duration);
      
      // Clean up URL
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
    }
  }, [recordedAudio, onRecordingComplete]);

  // Start new recording
  const startNewRecording = useCallback(() => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
    }
    
    // Clean up playback timer
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    
    setDuration(0);
    durationRef.current = 0;
    setPlaybackTime(0);
    setIsPlaying(false);
    setError(null);
    startRecording();
  }, [recordedAudio, startRecording]);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    // Clean up
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
    }

    // Clean up playback timer
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    durationRef.current = 0;
    setPlaybackTime(0);
    setAudioLevel(0);
    setError(null);
    setIsPlaying(false);
    onClose();
  }, [onClose, recordedAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[1100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            cursor: 'default'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isRecording) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              backgroundColor: '#FFFDFA',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
          >
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#000000'
            }}>
              Record Audio
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Record your voice message for Pst. Tru South
            </p>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#dc2626',
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Audio Visualizer */}
            <div style={{
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              {isRecording ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: '3px',
                        backgroundColor: '#ef4444',
                        borderRadius: '2px'
                      }}
                      animate={{
                        height: [8, 8 + (audioLevel * 40) * Math.random(), 8]
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '3px',
                        height: '8px',
                        backgroundColor: '#d1d5db',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Duration Display */}
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: isRecording ? '#ef4444' : recordedAudio ? (isPlaying ? '#ef4444' : '#10b981') : '#6b7280',
              marginBottom: '24px',
              fontFamily: 'monospace'
            }}>
              {recordedAudio 
                ? (isPlaying 
                    ? formatDuration(Math.max(0, recordedAudio.duration - playbackTime))
                    : formatDuration(recordedAudio.duration)
                  )
                : formatDuration(duration)
              }
            </div>

            {/* Audio Preview Player (hidden) */}
            {recordedAudio && (
              <audio
                ref={audioPlayerRef}
                src={recordedAudio.url}
                onEnded={() => {
                  setIsPlaying(false);
                  setPlaybackTime(0);
                  if (playbackIntervalRef.current) {
                    clearInterval(playbackIntervalRef.current);
                    playbackIntervalRef.current = null;
                  }
                }}
                style={{ display: 'none' }}
              />
            )}

            {/* Control Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {!isRecording && !recordedAudio ? (
                <button
                  onClick={startRecording}
                  disabled={isProcessing}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    border: 'none',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444'
                  }} />
                </button>
              ) : isRecording ? (
                <>
                  <button
                    onClick={togglePauseRecording}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '18px'
                    }}
                  >
                    {isPaused ? '▶' : '⏸'}
                  </button>
                  
                  <button
                    onClick={stopRecording}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#ffffff'
                    }} />
                  </button>
                </>
              ) : recordedAudio ? (
                <>
                  <button
                    onClick={isPlaying ? pauseRecordedAudio : playRecordedAudio}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '18px'
                    }}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  
                  <button
                    onClick={startNewRecording}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444'
                    }} />
                  </button>
                </>
              ) : null}
            </div>

            {/* Action Buttons */}
            {!isRecording && (
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                
                {recordedAudio && (
                  <button
                    onClick={submitRecording}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Use Recording
                  </button>
                )}
              </div>
            )}

            {isRecording && (
              <button
                onClick={cancelRecording}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            )}

            {isProcessing && (
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '16px',
                margin: '16px 0 0 0'
              }}>
                Processing recording...
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};