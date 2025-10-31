"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  isVisible: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1003,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50px',
        padding: '20px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: '20px',
          height: '20px',
          borderTop: '2px solid white',
          borderRadius: '50%'
        }}
      />
    </motion.div>
  )
}