"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ManOfTheDaySection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [sectionScrollProgress, setSectionScrollProgress] = useState(0)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [shouldScatter, setShouldScatter] = useState(false)
  const [contentScrollProgress, setContentScrollProgress] = useState(0)
  const [fadeScrollProgress, setFadeScrollProgress] = useState(0)
  const [sectionInView, setSectionInView] = useState(false)
  const [backgroundFixed, setBackgroundFixed] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false
            return
          }

          const section = sectionRef.current
          const rect = section.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const scrollY = window.scrollY
          const sectionTop = section.offsetTop
          const sectionHeight = section.offsetHeight

          // Check if section is in view
          const isInView = rect.top <= windowHeight && rect.bottom >= 0
          setSectionInView(isInView)

          // Simple visibility check - start animations when section is in view
          if (isInView && !animationStarted) {
            setAnimationStarted(true)
            // Trigger scatter after 1 second delay
            setTimeout(() => {
              setShouldScatter(true)
            }, 1000)
          }

          // Calculate content scroll progress for moving content up
          const contentStartScroll = sectionTop + windowHeight // Start when section is fully in view
          const contentEndScroll = sectionTop + sectionHeight - windowHeight // End when section bottom reaches viewport
          const contentScrollRange = contentEndScroll - contentStartScroll

          const contentProgress = contentScrollRange > 0
            ? Math.min(Math.max((scrollY - contentStartScroll) / contentScrollRange, 0), 1)
            : 0

          setContentScrollProgress(contentProgress)

          // Determine when background should become fixed
          const sectionTopAdjusted = sectionTop - 0 * (window.innerHeight)
          const shouldFixBackground = scrollY >= sectionTopAdjusted && rect.bottom > 0
          setBackgroundFixed(shouldFixBackground)

          // Calculate fade progress - starts as soon as we start scrolling into the section
          const fadeStartScroll = sectionTopAdjusted // Start fading immediately when section becomes active
          const fadeEndScroll = fadeStartScroll + windowHeight * 0.5 // Fade over 50vh of scroll
          const fadeRange = fadeEndScroll - fadeStartScroll

          const fadeProgress = fadeRange > 0
            ? Math.min(Math.max((scrollY - fadeStartScroll) / fadeRange, 0), 1)
            : 0

          setFadeScrollProgress(fadeProgress)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [animationStarted])

  // Photo positions - 7 photos scattered to random positions
  const photoPositions = [
    { x: -30, y: -25, rotation: 0 }, // Top left
    { x: 30, y: -30, rotation: 0 },  // Top right  
    { x: -5, y: -28, rotation: 0 },   // Top center
    { x: -15, y: 10, rotation: 0 },  // Middle left
    { x: 40, y: 15, rotation: 0 },   // Middle right
    { x: -35, y: 35, rotation: 0 },  // Bottom left
    { x: 20, y: 35, rotation: 0 },    // Bottom right
  ]

  // Sample photos
  const photos = [
    "https://picsum.photos/400/500?random=1",
    "https://picsum.photos/400/500?random=2",
    "https://picsum.photos/400/500?random=3",
    "https://picsum.photos/400/500?random=4",
    "https://picsum.photos/400/500?random=5",
    "https://picsum.photos/400/500?random=6",
    "https://picsum.photos/400/500?random=6"
  ]

  return (
    <div
      ref={sectionRef}
      style={{
        height: '300vh',
        backgroundColor: '#FFFDFA',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-80vh',
        zIndex: 200000
      }}
    >
      {/* Background layer - conditionally fixed */}
      <div
        style={{
          position: backgroundFixed ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 1,
          backgroundColor: '#FFFDFA',
        }}
      >
        {/* Photos container - relative to this section */}
        {photos.map((photo, index) => {
          const position = photoPositions[index]
          const stackOffset = index * 3
          const shouldMove = shouldScatter

          return (
            <motion.div
              key={index}
              animate={{
                x: shouldMove ? `${position.x}vw` : `${stackOffset}px`,
                y: shouldMove ? `${position.y}vh` : `${stackOffset}px`,
                rotate: 0,
                scale: shouldMove ? 0.7 : 0.9,
                opacity: 1
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: index * 0.1
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '250px',
                borderRadius: '0px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                transformOrigin: 'center',
                zIndex: photos.length - index,
                marginTop: '-125px',
                marginLeft: '-100px',
              }}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: Math.max(0.3, 1 - fadeScrollProgress) // Fade down to 30% minimum
                }}
              />
            </motion.div>
          )
        })}

        {/* text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: Math.max(0, 1 - fadeScrollProgress),
            zIndex: 10,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(60px, 12vw, 140px)',
              fontWeight: '900',
              textAlign: 'center',
              fontFamily: 'var(--font-smooch-sans), sans-serif',
              lineHeight: '0.9',
              margin: 0,
              color: 'black'
            }}
          >
            Lorem
          </motion.h1>
        </div>
      </div>

      {/* Content area - scrolls over background */}
      <div
        style={{
          // minHeight: '100vh',
          position: 'absolute',
          top: '80vh', // Start below the viewport
          left: 0,
          right: 0,
          transform: `translateY(${-contentScrollProgress * 60}vh)`, // Move up as user scrolls
          zIndex: 10,
          padding: '5%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Content about the man */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            textAlign: 'center',
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '50px'
          }}
        >
          {/* About section */}
          <div>
            {/* Bold text with circle image */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
              {/* Circle image */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#ddd'
              }}>
                <img
                  src="https://picsum.photos/200/200?random=10"
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Bold text */}
              <motion.h2
                style={{
                  fontSize: 'clamp(40px, 8vw, 40px)',
                  lineHeight: '1.1',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: 'black',
                  margin: 0,
                  fontFamily: 'var(--font-smooch-sans), sans-serif',
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias aperiam ex quisquam? Eius ipsam iusto fugit
                consectetur dicta suscipit accusamus animi facere blanditiis beatae.
                Assumenda neque sint quasi explicabo eaque.
              </motion.h2>
            </div>

            {/* Lighter smaller text below */}
            <motion.div
              style={{
                fontSize: '16px',
                lineHeight: '1.1',
                color: 'black',
                marginBottom: '40px',
                fontWeight: '300',
                fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                textAlign: 'left',
                marginLeft: '100px' // 80px (image width) + 20px (gap) = 100px
              }}
            >
              <p style={{ marginBottom: '20px' }}>
                A man of faith, wisdom, and unwavering dedication to his calling.
                Pastor Tru South King has touched countless lives through his ministry,
                leadership, and compassionate heart.
              </p>
              <p style={{ marginBottom: '20px' }}>
                For over two decades, Pastor Tru South has been a beacon of hope and
                inspiration in the community. His powerful sermons, gentle guidance,
                and genuine care for others have made him beloved by all who know him.
              </p>
              <p>
                Today we celebrate not just another year of life, but a life lived
                in service to God and others. His legacy continues to grow with each
                person he touches and each life he transforms.
              </p>
            </motion.div>

            {/* Three short text blocks in a row */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              marginTop: '40px',
              marginLeft: '100px' // 80px (image width) + 20px (gap) = 100px
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <p style={{
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#555',
                  margin: 0,
                  maxWidth: '200px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                }}>
                  Lorem ipsum dolor sit amet, 
                  adipiscing elit. Sed do
                  eiusmod tempor                   
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p style={{
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#555',
                  maxWidth: '200px',
                  textAlign: 'left',
                  margin: 0,
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                }}>
                  Ut enim ad minim veniam,
                  exercitation ullamco
                  laboris nisi ut
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p style={{
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#555',
                  maxWidth: '200px',
                  textAlign: 'left',
                  margin: 0,
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                }}>
                  Duis aute irure dolor in
                  in voluptate velit
                  esse cillum dolo
                </p>
              </motion.div>
            </div>

            {/* Awards Section - items with different fonts */}
            <div style={{
              marginTop: '60px',
              width: '100%'
            }}>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
                  fontWeight: '600',
                  color: 'black',
                  marginBottom: '30px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-smooch-sans), sans-serif',
                }}
              >
                Awards & Recognition
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  color: '#940404',
                  width: '60%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  textAlign: 'left'
                }}
              >
                {[
                  { text: 'Lorem', font: 'serif' },
                  { text: 'Ipsum', font: 'monospace' },
                  { text: 'Dolor', font: 'var(--font-smooch-sans), sans-serif' },
                  { text: 'Sit', font: 'var(--font-geist-sans), system-ui' },
                  { text: 'Amet', font: 'Georgia, serif' },
                  { text: 'Consectetur', font: 'Arial, sans-serif' },
                  { text: 'Adipiscing', font: 'Times, serif' },
                  { text: 'Elit', font: 'Courier, monospace' },
                  { text: 'Sed', font: 'Helvetica, sans-serif' },
                  { text: 'Eiusmod', font: 'Palatino, serif' },
                  { text: 'Tempor', font: 'Monaco, monospace' },
                  { text: 'Incididunt', font: 'Verdana, sans-serif' },
                  { text: 'Labore', font: 'Garamond, serif' },
                  { text: 'Dolore', font: 'Impact, sans-serif' },
                  { text: 'Magna', font: 'Trebuchet MS, sans-serif' },
                  { text: 'Aliqua', font: 'Book Antiqua, serif' },
                  { text: 'Enim', font: 'Lucida Console, monospace' },
                  { text: 'Minim', font: 'Tahoma, sans-serif' },
                  { text: 'Veniam', font: 'Century, serif' },
                  { text: 'Quis', font: 'Courier New, monospace' },
                  { text: 'Nostrud', font: 'Optima, sans-serif' },
                  { text: 'Exercitation', font: 'Baskerville, serif' },
                  { text: 'Ullamco', font: 'Consolas, monospace' },
                  { text: 'Laboris', font: 'Futura, sans-serif' },
                  { text: 'Nisi', font: 'Didot, serif' },
                  { text: 'Aliquip', font: 'Menlo, monospace' },
                  { text: 'Commodo', font: 'Avenir, sans-serif' },
                  { text: 'Consequat', font: 'Minion Pro, serif' },
                  { text: 'Duis', font: 'Source Code Pro, monospace' },
                  { text: 'Aute', font: 'Gill Sans, sans-serif' }
                ].map((award, index) => (
                  <span key={index}>
                    <span
                      style={{
                        fontFamily: award.font,
                        fontWeight: '500'
                      }}
                    >
                      {award.text}
                    </span>
                    {index < 29 && <span style={{ fontFamily: 'monospace', margin: '0 4px' }}>/</span>}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Photo on the far right side */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '80px'
            }}>
              <div style={{
                width: '250px',
                height: '350px',
                overflow: 'hidden',
                backgroundColor: '#ddd'
              }}>
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                src="https://picsum.photos/600/800?random=11"
                alt="Featured photo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              </div>
            </div>

            {/* Bold text section */}
            <div style={{
              marginTop: '60px',
              lineHeight: '1',
              textAlign: 'left'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p style={{
                  fontSize: '180px',
                  fontWeight: '700',
                  color: 'black',
                  margin: 0,
                  marginBottom: '10px',
                  fontFamily: 'var(--font-smooch-sans), sans-serif',
                }}>
                  TSK 10:30
                </p>
                <p style={{
                  fontSize: '180px',
                  fontWeight: '700',
                  color: 'black',
                  margin: 0,
                  fontFamily: 'var(--font-smooch-sans), sans-serif',
                }}>
                  2025©
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ManOfTheDaySection