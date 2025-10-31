import React from 'react';
import { motion } from 'framer-motion';

interface PostsSkeletonProps {
  count?: number;
}

export const PostsSkeleton: React.FC<PostsSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonDouble key={index} reversed={index % 2 === 1} />
      ))}
    </div>
  );
};

const SkeletonDouble: React.FC<{ reversed?: boolean }> = ({ reversed = false }) => {
  return (
    <div className="flex mt-20 h-auto md:flex-row flex-col">
      <div className="w-full md:w-2/3 transition-all duration-500 ease-out">
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66%' }}>
          <motion.div 
            className="absolute inset-0 bg-gray-200 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="text-base p-2.5">
          <motion.div 
            className="h-6 bg-gray-200 rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded mb-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded w-3/4 mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div 
            className="h-3 bg-gray-200 rounded w-1/2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </div>

      <div className="w-full md:w-1/3 transition-all duration-500 ease-out">
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66%' }}>
          <motion.div 
            className="absolute inset-0 bg-gray-200 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
        <div className="text-base p-2.5">
          <motion.div 
            className="h-6 bg-gray-200 rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded mb-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded w-2/3 mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.div 
            className="h-3 bg-gray-200 rounded w-1/3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          />
        </div>
      </div>
    </div>
  );
};

interface EmptyPostsProps {
  onCreatePost?: () => void;
}

export const EmptyPosts: React.FC<EmptyPostsProps> = ({ onCreatePost }) => {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2m-8 0V2m0 2v2m0-2h8m-8 2h8" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
      <p className="text-gray-600 mb-6">Be the first to share something about Pst. Tru South!</p>
      <button 
        onClick={onCreatePost}
        style={{
          padding: '12px 32px',
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1f2937';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
        Create First Post
      </button>
    </div>
  );
};