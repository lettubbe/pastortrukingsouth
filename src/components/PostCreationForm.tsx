import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FileUpload } from './FileUpload';
import { useCreatePostMutation } from '@/hooks/usePostsQuery';
import { CreatePostRequest } from '@/lib/types/post.types';
import { handleError } from '@/lib/handleError';
import showToast from '@/lib/showToast';

interface PostCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  postType: 'video' | 'photo' | 'audio' | 'text';
  buttonPosition: { x: number; y: number; width: number; height: number };
  onPostCreated?: () => void;
}

export const PostCreationForm: React.FC<PostCreationFormProps> = ({
  isOpen,
  onClose,
  postType,
  buttonPosition,
  onPostCreated
}) => {
  const [formData, setFormData] = useState({
    caption: '',
    content: '',
    authorName: '',
    file: null as File | null
  });
  const [preview, setPreview] = useState<string | null>(null);
  const createPostMutation = useCreatePostMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAcceptedTypes = () => {
    switch (postType) {
      case 'video':
        return ['video/mp4', 'video/webm', 'video/ogg'];
      case 'photo':
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      case 'audio':
        return ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/webm'];
      default:
        return [];
    }
  };

  const getMaxSize = () => {
    switch (postType) {
      case 'video':
        return 50; // MB
      case 'photo':
        return 10; // MB
      case 'audio':
        return 20; // MB
      default:
        return 10; // MB
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    setFormData(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: '' }));

    // Create preview for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }, []);

  const handleFileRemove = useCallback(() => {
    setFormData(prev => ({ ...prev, file: null }));
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.caption.trim()) {
      newErrors.caption = 'Caption is required';
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Name is required';
    }

    if (postType === 'text' && !formData.content.trim()) {
      newErrors.content = 'Content is required for text posts';
    }

    if (postType !== 'text' && !formData.file) {
      newErrors.file = 'File is required';
    }

    // Basic validation (removed service validation for simplicity)
    if (formData.caption.length > 500) {
      newErrors.caption = 'Caption must be less than 500 characters';
    }

    if (formData.content && formData.content.length > 2000) {
      newErrors.content = 'Content must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const postData: CreatePostRequest = {
      type: postType,
      caption: formData.caption.trim(),
      authorName: formData.authorName.trim(),
      ...(postType === 'text' && { content: formData.content.trim() }),
      ...(formData.file && { file: formData.file })
    };

    createPostMutation.mutate(postData, {
      onSuccess: () => {
        showToast('success', 'Post created successfully!');
        onPostCreated?.();
        handleClose();
      },
      onError: (error: unknown) => {
        handleError(error);
      }
    });
  };

  const handleClose = () => {
    setFormData({ caption: '', content: '', authorName: '', file: null });
    setErrors({});
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
    onClose();
  };

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getTitle = () => {
    switch (postType) {
      case 'video':
        return 'Share a Video';
      case 'photo':
        return 'Share an Image';
      case 'audio':
        return 'Share Audio';
      case 'text':
        return 'Share Your Thoughts';
      default:
        return 'Create Post';
    }
  };

  const getDescription = () => {
    switch (postType) {
      case 'video':
        return 'Say something about Pst. Tru South with a video';
      case 'photo':
        return 'Say something about Pst. Tru South with an image';
      case 'audio':
        return 'Say something about Pst. Tru South with audio';
      case 'text':
        return 'Say something about Pst. Tru South';
      default:
        return 'Say something about Pst. Tru South';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            cursor: 'default'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            initial={{ 
              scale: buttonPosition.width / 500,
              opacity: 1,
              x: buttonPosition.x - window.innerWidth / 2,
              y: buttonPosition.y - window.innerHeight / 2,
              borderRadius: '50%'
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              x: 0, 
              y: 0,
              borderRadius: '16px'
            }}
            exit={{ 
              scale: buttonPosition.width / 500,
              opacity: 1,
              x: buttonPosition.x - window.innerWidth / 2,
              y: buttonPosition.y - window.innerHeight / 2,
              borderRadius: '50%'
            }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 35,
              duration: 0.4
            }}
            style={{ 
              backgroundColor: '#FFFDFA',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
              padding: '24px',
              height: '100%',
              overflowY: 'auto'
            }}
            className="hide-scrollbar max-h-[90vh] rounded-2xl max-w-2xl w-full mx-4 shadow-2xl"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div>
                  <h3 
                    className="text-3xl font-bold text-black"
                    style={{ fontFamily: 'var(--font-style-script), cursive' }}
                  >
                    {getTitle()}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {getDescription()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-black text-3xl font-light transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </motion.div>

              {/* Form Fields */}
              <motion.div 
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {/* Author Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.authorName ? '1px solid #ef4444' : 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f2f2f7',
                      color: '#000000'
                    }}
                    placeholder="Enter your name (anonymous is fine)"
                    maxLength={50}
                    onFocus={(e) => {
                      if (!errors.authorName) {
                        e.target.style.border = 'none';
                        e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.authorName) {
                        e.target.style.border = 'none';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.authorName && (
                    <p style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}>
                      {errors.authorName}
                    </p>
                  )}
                </div>

                {/* File Upload (for non-text posts) */}
                {postType !== 'text' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      {postType.charAt(0).toUpperCase() + postType.slice(1)} File
                    </label>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      onFileRemove={handleFileRemove}
                      acceptedTypes={getAcceptedTypes()}
                      maxSize={getMaxSize()}
                      fileType={postType}
                      selectedFile={formData.file}
                      preview={preview}
                    />
                    {errors.file && (
                      <p style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        marginTop: '4px'
                      }}>
                        {errors.file}
                      </p>
                    )}
                  </div>
                )}

                {/* Text Content (for text posts) */}
                {postType === 'text' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.content ? '1px solid #ef4444' : 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#f2f2f7',
                        resize: 'none',
                        fontFamily: 'inherit',
                        color: '#000000'
                      }}
                      placeholder="Write your thoughts here..."
                      rows={6}
                      maxLength={2000}
                      onFocus={(e) => {
                        if (!errors.content) {
                          e.target.style.border = 'none';
                          e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.content) {
                          e.target.style.border = 'none';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                    {errors.content && (
                      <p style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        marginTop: '4px'
                      }}>
                        {errors.content}
                      </p>
                    )}
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      {formData.content.length}/2000 characters
                    </p>
                  </div>
                )}

                {/* Caption */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Caption
                  </label>
                  <textarea
                    value={formData.caption}
                    onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.caption ? '1px solid #ef4444' : 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f2f2f7',
                      resize: 'none',
                      fontFamily: 'inherit',
                      color: '#000000'
                    }}
                    placeholder="Write a caption for your post..."
                    rows={3}
                    maxLength={500}
                    onFocus={(e) => {
                      if (!errors.caption) {
                        e.target.style.border = 'none';
                        e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.caption) {
                        e.target.style.border = 'none';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {errors.caption && (
                    <p style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}>
                      {errors.caption}
                    </p>
                  )}
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '4px'
                  }}>
                    {formData.caption.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={createPostMutation.isPending}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      border: '1px solid #d1d5db',
                      color: '#374151',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: createPostMutation.isPending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: createPostMutation.isPending ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!createPostMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!createPostMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPostMutation.isPending}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      backgroundColor: createPostMutation.isPending ? '#6b7280' : '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: createPostMutation.isPending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: createPostMutation.isPending ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!createPostMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#1f2937';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!createPostMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#000000';
                      }
                    }}
                  >
                    {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                  </button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};