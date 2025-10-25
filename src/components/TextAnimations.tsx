import React from 'react';
import { motion } from 'framer-motion';
import { translate, fade, normalText } from '../animations/textAnimations';

interface TextAnimationsProps {
  pageAnimationStarted: boolean;
  scrollProgress: number;
}

export const AnimatedChars: React.FC<{
  word: string;
  pageAnimationStarted: boolean;
  scrollProgress: number;
}> = ({ word, pageAnimationStarted, scrollProgress }) => {
  const chars: React.ReactElement[] = [];
  word.split("").forEach((char, i) => {
    const progress = Math.max(0, Math.min(1, scrollProgress * 8));
    const charProgress = Math.max(0, Math.min(1, progress));

    // Calculate scroll-based transform
    const scrollY = charProgress * -100;
    const scrollOpacity = 1 - charProgress;

    chars.push(
      <span
        key={char + i}
        style={{ 
          display: 'inline-block',
          // SCROLL ANIMATION VIA CSS
          transform: pageAnimationStarted && scrollProgress > 0 ? `translateY(${scrollY}%)` : undefined,
          opacity: pageAnimationStarted && scrollProgress > 0 ? scrollOpacity : undefined,
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        <motion.span
          // ENTRANCE ANIMATION ONLY
          initial={{ y: "100%", opacity: 0 }}
          animate={pageAnimationStarted ? "enter" : "initial"}
          variants={{
            initial: { y: "100%", opacity: 0 },
            enter: { 
              y: "0%", 
              opacity: 1,
              transition: { 
                duration: 0.6, 
                ease: [0.76, 0, 0.24, 1],
                delay: 1.2 + (i * 0.05)
              }
            }
          }}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      </span>
    );
  });
  
  return <>{chars}</>;
};

const textStagger = {
  initial: {
    y: "100%",
    opacity: 0
  },
  enter: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as any, delay: 1.2 + (i * 0.08) }
  })
};

export const FadeText: React.FC<{
  text: string;
  pageAnimationStarted: boolean;
  scrollProgress: number;
  fadeOnScroll?: boolean;
  startDelay?: number;
}> = ({ text, pageAnimationStarted, scrollProgress, fadeOnScroll = false, startDelay = 0 }) => {
  const calculatedOpacity = fadeOnScroll ? Math.max(0, 1 - (scrollProgress * 15)) : 1;
  const words = text.split(" ");
  const wordsPerLine = Math.ceil(words.length / 3); // Approximate 3 lines
  const lines: string[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  const textStaggerWithDelay = {
    initial: {
      y: "100%",
      opacity: 0
    },
    enter: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.76, 0, 0.24, 1] as any, 
        delay: 1.2 + startDelay + (i * 0.15) 
      }
    })
  };

  return (
    <>
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          style={{
            display: 'block',
            overflow: 'hidden',
            // SCROLL ANIMATION VIA CSS
            opacity: pageAnimationStarted && fadeOnScroll ? calculatedOpacity : undefined,
            transition: 'opacity 0.2s ease-out'
          }}
        >
          <motion.span
            custom={lineIndex}
            variants={textStaggerWithDelay}
            initial="initial"
            animate={pageAnimationStarted ? "enter" : "initial"}
            style={{ 
              display: 'block'
            }}
          >
            {line}
            {lineIndex < lines.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
};

export const WordStagger: React.FC<{
  text: string;
  pageAnimationStarted: boolean;
  startDelay?: number;
}> = ({ text, pageAnimationStarted, startDelay = 0 }) => {
  const words = text.split(" ");
  
  const wordStaggerVariants = {
    initial: {
      y: "100%",
      opacity: 0
    },
    enter: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as any, delay: 1.2 + startDelay + (i * 0.2) }
    })
  };

  return (
    <>
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          custom={wordIndex}
          variants={wordStaggerVariants}
          initial="initial"
          animate={pageAnimationStarted ? "enter" : "initial"}
          style={{ 
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: wordIndex < words.length - 1 ? '0.25em' : '0'
          }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
};

export const NormalText: React.FC<{
  text: string;
  pageAnimationStarted: boolean;
  scrollProgress: number;
}> = ({ text, pageAnimationStarted, scrollProgress }) => {
  return (
    <motion.span
      variants={normalText}
      initial="initial"
      animate={
        scrollProgress > 0 ? "exit" : 
        pageAnimationStarted ? "enter" : "initial"
      }
      style={{ display: 'inline-block' }}
    >
      {text}
    </motion.span>
  );
};