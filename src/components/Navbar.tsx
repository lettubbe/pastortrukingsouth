'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { WordStagger } from './TextAnimations';

// CSS styles for responsive design
const navbarStyles = `
  .navbar-container {
    padding: 32px 48px;
  }
  
  .navbar-logo {
    font-size: 24px;
  }
  
  .menu-overlay {
    padding-top: 120px;
    padding-left: 80px;
    padding-right: 80px;
  }
  
  .menu-container {
    justify-content: space-between;
    flex-direction: row;
  }
  
  .menu-links {
    gap: 30px;
    margin-bottom: 60px;
  }
  
  .menu-link-text {
    font-size: 56px;
    line-height: 1;
    word-break: normal;
  }
  
  .media-display {
    display: block;
  }
  
  @media (max-width: 768px) {
    .navbar-container {
      padding: 20px 24px;
    }
    
    .navbar-logo {
      font-size: 18px;
    }
    
    .menu-overlay {
      padding-top: 80px;
      padding-left: 24px;
      padding-right: 24px;
    }
    
    .menu-container {
      justify-content: flex-start;
      flex-direction: column;
    }
    
    .menu-links {
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .menu-link-text {
      font-size: 42px;
      line-height: 1.1;
      word-break: break-word;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    
    .menu-link-text span {
      display: inline !important;
    }
    
    .media-display {
      display: none;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = navbarStyles;
  document.head.appendChild(styleElement);
}

const translate = {
  initial: {
    y: "100%",
    opacity: 0
  },
  enter: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as any, delay: i * 0.02 }
  }),
  exit: (i: number) => ({
    y: "100%",
    opacity: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as any, delay: i * 0.01 }
  })
};

const blur = {
  initial: {
    filter: "blur(0px)",
    opacity: 1
  },
  open: {
    filter: "blur(4px)",
    opacity: 0.6,
    transition: { duration: 0.3 }
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const mainLinks = [
  { title: "About", href: "/about", media: { type: "image", src: "/images/hero1.jpg" } },
  { title: "Say something", href: "/post", media: { type: "video", src: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/wife%26kids.mp4" } },
  // { title: "BTS", href: "/behindthescenes", media: { type: "gif", src: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" } }
];

const socialLinks = [
  { title: "instagram", href: "https://instagram.com/trusouthking" },
  { title: "youtube", href: "https://www.youtube.com/@trusouthking" },
  // { title: "kingschat", href: "/kingschat" }
];

const swingOut = {
  initial: { 
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  },
  animate: { 
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'polygon(0% 0%, 100% 0%, 100% 20%, 0% 60%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
    ],
    transition: { 
      duration: 0.8, 
      ease: [0.76, 0, 0.24, 1] as any,
      times: [0, 0.6, 1]
    } 
  },
  exit: { 
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 20%, 0% 60%)',
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
    ],
    transition: { 
      duration: 0.6, 
      ease: [0.76, 0, 0.24, 1] as any,
      times: [0, 0.4, 1]
    } 
  }
};

const menuContentSwing = {
  initial: {
    y: 0,
    scale: 1
  },
  animate: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0, 0.4, 1] as any
    }
  },
  exit: {
    y: -600,
    // x: 50,
    scale: 2.8,
    rotateZ: 4,
    transformOrigin: 'left top',
    transition: {
      duration: 0.8,
      ease: [0.6, 0, 0.4, 1] as any
    }
  }
};

export default function Navbar({ onMenuToggle, pageAnimationStarted, forceBlackText }: { onMenuToggle?: (isOpen: boolean) => void; pageAnimationStarted?: boolean; forceBlackText?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState({ isActive: false, index: 0 });
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [isOverEditSection, setIsOverEditSection] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHasScrolled(scrollY > 50);
      setShowLogo(scrollY > 200);
      
      // Hero section is 160vh tall, so approximately 160% of viewport height
      const heroHeight = window.innerHeight * 1.6;
      setIsOverHero(scrollY < heroHeight - 100); // Add buffer for transition
      
      // Check if we're over the EditSection
      const editSectionStart = window.innerHeight * 5.4;
      const editSectionEnd = window.innerHeight * 7;
      setIsOverEditSection(scrollY >= editSectionStart && scrollY <= editSectionEnd);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up body styles on unmount
      if (typeof document !== 'undefined') {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = 'auto';
      }
    };
  }, []);

  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
    
    // Prevent body scroll when menu is open
    if (typeof document !== 'undefined') {
      if (newState) {
        // Store current scroll position
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      } else {
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = 'auto';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  };

  const getChars = (word: string) => {
    let chars: React.ReactElement[] = [];
    word.split("").forEach((char, i) => {
      chars.push(
        <motion.span
          custom={i}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          key={char + i}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      );
    });
    return chars;
  };

  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      zIndex: 50 
    }}>
      {/* Main navbar */}
      <div className="navbar-container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        {/* Logo */}
        <a href="/" style={{ zIndex: 50, overflow: 'hidden', position: 'relative', textDecoration: 'none', cursor: 'pointer' }}>
          {/* Text Logo */}
          <h1 
            className="navbar-logo"
            style={{ 
              fontWeight: '500', 
              color: isMenuOpen ? 'white' : (forceBlackText ? 'black' : 'white'),
              margin: 0,
              fontFamily: 'var(--font-smooch-sans), sans-serif',
              opacity: hasScrolled ? 0 : 1,
              transition: 'opacity 0.4s ease',
              position: 'relative'
            }}
          >
            <WordStagger 
              text="Tru South King"
              pageAnimationStarted={pageAnimationStarted || false}
              startDelay={0}
            />
          </h1>
          
          {/* Coin Logo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              opacity: showLogo ? 1 : 0,
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              transformOrigin: 'center'
            }}
          >
            <Image
              src="/images/coinLogo.png"
              alt="Tru South King Logo"
              width={40}
              height={40}
              style={{
                objectFit: 'contain',
                transform: showLogo ? 'scale(1)' : 'scale(0.8)',
                transition: 'transform 0.4s ease'
              }}
            />
          </div>
        </a>

        {/* Hamburger Menu Button */}
        <button 
          onClick={handleMenuToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 50,
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{ 
            position: 'relative',
            height: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '40px'
          }}>
            <motion.span 
              style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: isMenuOpen ? 'white' : (forceBlackText ? 'black' : (isOverHero || isOverEditSection ? 'white' : 'black')),
                position: 'absolute',
                top: '-18%',
                left: '0%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s ease'
              }}
              animate={{
                y: isMenuOpen ? -30 : 0,
                opacity: isMenuOpen ? 0 : 1
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              Menu
            </motion.span>
            <motion.span 
              style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: isMenuOpen ? 'white' : (forceBlackText ? 'black' : (isOverHero || isOverEditSection ? 'white' : 'black')),
                position: 'absolute',
                top: '-18%',
                left: '0%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s ease'
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{
                y: isMenuOpen ? 0 : 30,
                opacity: isMenuOpen ? 1 : 0
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              Close
            </motion.span>
          </div>
          <div style={{ position: 'relative' }}>
            <motion.div
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: isMenuOpen ? 'white' : (forceBlackText ? 'black' : (isOverHero || isOverEditSection ? 'white' : 'black')),
                marginBottom: isMenuOpen ? 0 : '4px',
                transformOrigin: 'center',
                transition: 'background-color 0.3s ease'
              }}
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? 1 : 0
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: isMenuOpen ? 'white' : (forceBlackText ? 'black' : (isOverHero || isOverEditSection ? 'white' : 'black')),
                marginTop: isMenuOpen ? 0 : '4px',
                transformOrigin: 'center',
                transition: 'background-color 0.3s ease'
              }}
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? -1 : 0
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </button>
      </div>

      {/* Sliding Background */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={swingOut}
            initial="initial"
            animate="animate"
            exit="exit"
            className="menu-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: '#0D1117',
              overflow: 'hidden',
              zIndex: 40,
              transformOrigin: 'top',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              boxSizing: 'border-box'
            }}
          >
            <div className="menu-container" style={{ 
              display: 'flex', 
              width: '100%', 
              alignItems: 'flex-start',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
              <motion.div
              variants={menuContentSwing}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              {/* Main Navigation Links */}
              <div className="menu-links" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
              {mainLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => handleMenuToggle()}
                  style={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <motion.p
                    className="menu-link-text"
                    onMouseOver={() => setSelectedLink({ isActive: true, index })}
                    onMouseLeave={() => setSelectedLink({ isActive: false, index })}
                    variants={blur}
                    animate={selectedLink.isActive && selectedLink.index !== index ? "open" : "closed"}
                    style={{
                      fontWeight: '300',
                      textTransform: 'uppercase',
                      color: '#FFF3E6',
                      margin: 0,
                      overflow: 'hidden',
                      fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                      width: '100%',
                      maxWidth: '100%',
                      wordWrap: 'break-word'
                    }}
                  >
                    {getChars(link.title)}
                  </motion.p>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'flex-start',
              gap: '20px'
            }}>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => handleMenuToggle()}
                  style={{
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <motion.p
                    style={{
                      fontSize: '16px',
                      fontWeight: 'normal',
                      color: 'white',
                      opacity: 0.6,
                      margin: 0,
                      overflow: 'hidden',
                      fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {getChars(link.title)}
                  </motion.p>
                </a>
              ))}
            </div>
            </motion.div>

            {/* Media Display */}
            <div className="media-display" style={{ 
              position: 'relative',
              width: '600px',
              height: '300px',
              marginRight: '80px'
            }}>
              {selectedLink.isActive && mainLinks[selectedLink.index]?.media && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {mainLinks[selectedLink.index].media.type === 'video' ? (
                    <video
                      src={mainLinks[selectedLink.index].media.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <img
                      src={mainLinks[selectedLink.index].media.src}
                      alt={mainLinks[selectedLink.index].title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </motion.div>
              )}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}