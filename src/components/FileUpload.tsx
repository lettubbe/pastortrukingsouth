import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AudioRecorder } from './AudioRecorder';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  acceptedTypes: string[];
  maxSize: number; // in MB
  fileType: 'video' | 'photo' | 'audio';
  selectedFile?: File | null;
  preview?: string | null;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes,
  maxSize,
  fileType,
  selectedFile,
  preview,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`
      };
    }

    return { valid: true };
  };

  const handleFileChange = (file: File) => {
    setError(null);
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleAudioRecordingComplete = (audioBlob: Blob, duration: number) => {
    // Create a File object from the blob
    const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
      type: 'audio/webm'
    });
    
    setError(null);
    onFileSelect(audioFile);
    setShowAudioRecorder(false);
  };

  const getFileTypeIcon = () => {
    switch (fileType) {
      case 'video':
        return '/icons/video.svg';
      case 'photo':
        return '/icons/image.svg';
      case 'audio':
        return '/icons/audio.svg';
      default:
        return '/icons/image.svg';
    }
  };

  const getFileTypeText = () => {
    switch (fileType) {
      case 'video':
        return 'Drop video file here or click to browse';
      case 'photo':
        return 'Drop image file here or click to browse';
      case 'audio':
        return 'Drop audio file here or click to browse';
      default:
        return 'Drop file here or click to browse';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <AnimatePresence>
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'relative',
              border: isDragging 
                ? '2px dashed #3b82f6'
                : error 
                  ? '2px dashed #ef4444'
                  : '2px dashed #d1d5db',
              backgroundColor: isDragging 
                ? '#eff6ff'
                : error 
                  ? '#fef2f2'
                  : '#f9fafb',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleInputChange}
              className="hidden"
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Image
                src={getFileTypeIcon()}
                alt={fileType}
                width={48}
                height={48}
                style={{ opacity: 0.6 }}
              />
              
              <div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#374151',
                  margin: 0
                }}>
                  {getFileTypeText()}
                </p>
              </div>

              {/* Record Live Button for Audio */}
              {fileType === 'audio' && (
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '16px',
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAudioRecorder(true);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                    }}
                  >
                    🎤 Record Live
                  </button>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '8px',
                    margin: '8px 0 0 0'
                  }}>
                    or drop/upload an audio file
                  </p>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px'
                }}
              >
                <p style={{
                  fontSize: '14px',
                  color: '#dc2626',
                  margin: 0
                }}>
                  {error}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'relative',
              border: '2px solid #86efac',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                  {preview && (fileType === 'photo' || fileType === 'video') ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                      {fileType === 'photo' ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={preview}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Image
                        src={getFileTypeIcon()}
                        alt={fileType}
                        width={32}
                        height={32}
                        className="opacity-60"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                  setError(null);
                }}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Recorder Modal */}
      <AudioRecorder
        isOpen={showAudioRecorder}
        onRecordingComplete={handleAudioRecordingComplete}
        onClose={() => setShowAudioRecorder(false)}
      />
    </div>
  );
};