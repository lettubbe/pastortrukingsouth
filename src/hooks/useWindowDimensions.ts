"use client"

import { useState, useEffect } from 'react'

interface WindowDimensions {
  width: number
  height: number
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({ 
    width: 1200, 
    height: 800 
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      setWindowDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      })
      
      const handleResize = () => {
        setWindowDimensions({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        })
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { windowDimensions, isClient }
}