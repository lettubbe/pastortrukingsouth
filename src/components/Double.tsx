import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface Project {
  src: string;
  name: string;
  description: string;
  year: string;
}

interface DoubleProps {
  projects: Project[];
  reversed?: boolean;
}

export const Double: React.FC<DoubleProps> = ({ projects, reversed = false }) => {
  const firstImage = useRef<HTMLDivElement>(null);
  const secondImage = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  let requestAnimationFrameId: number | null = null;
  let xPercent = reversed ? 100 : 0;
  let currentXPercent = reversed ? 100 : 0;
  const speed = 0.15;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) {
        if (firstImage.current) firstImage.current.style.width = '100%';
        if (secondImage.current) secondImage.current.style.width = '100%';
      } else {
        if (firstImage.current) firstImage.current.style.width = reversed ? '33.33%' : '66.66%';
        if (secondImage.current) secondImage.current.style.width = reversed ? '66.66%' : '33.33%';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [reversed]);

  const manageMouseMove = (e: React.MouseEvent) => {
    if (!isMobile) {
      const { clientX } = e;
      xPercent = (clientX / window.innerWidth) * 100;

      if (!requestAnimationFrameId) {
        requestAnimationFrameId = window.requestAnimationFrame(animate);
      }
    }
  };

  const setHoverEffect = (hoveredImage: string) => {
    if (isMobile) {
      if (firstImage.current) firstImage.current.style.width = '100%';
      if (secondImage.current) secondImage.current.style.width = '100%';
    }
  };

  const animate = () => {
    if (!isMobile) {
      const xPercentDelta = xPercent - currentXPercent;
      currentXPercent = currentXPercent + xPercentDelta * speed;

      const firstImagePercent = 66.66 - currentXPercent * 0.33;
      const secondImagePercent = 33.33 + currentXPercent * 0.33;

      if (firstImage.current) firstImage.current.style.width = `${firstImagePercent}%`;
      if (secondImage.current) secondImage.current.style.width = `${secondImagePercent}%`;

      if (Math.round(xPercent) === Math.round(currentXPercent)) {
        window.cancelAnimationFrame(requestAnimationFrameId!);
        requestAnimationFrameId = null;
      } else {
        window.requestAnimationFrame(animate);
      }
    }
  };

  return (
    <div 
      onMouseMove={manageMouseMove} 
      className="flex mt-20 h-auto md:flex-row flex-col"
    >
      <div
        ref={firstImage}
        className="w-full md:w-2/3 transition-all duration-500 ease-out"
        onMouseEnter={() => setHoverEffect('first')}
        onTouchStart={() => setHoverEffect('first')}
      >
        <div className="relative w-full" style={{ paddingBottom: '66%' }}>
          <Image
            src={`/images/${projects[0].src}`}
            fill={true}
            alt={projects[0].name}
            className="object-cover"
          />
        </div>
        <div className="text-base p-2.5">
          <h3 className="text-lg mb-1.5 mt-0 font-normal">{projects[0].name}</h3>
          <p className="text-sm m-0 text-gray-400">{projects[0].description}</p>
          <p className="text-sm m-0 text-gray-500 mt-2.5 mb-2.5">{projects[0].year}</p>
        </div>
      </div>

      <div
        ref={secondImage}
        className="w-full md:w-1/3 transition-all duration-500 ease-out"
        onMouseEnter={() => setHoverEffect('second')}
        onTouchStart={() => setHoverEffect('second')}
      >
        <div className="relative w-full" style={{ paddingBottom: '66%' }}>
          <Image
            src={`/images/${projects[1].src}`}
            fill={true}
            alt={projects[1].name}
            className="object-cover"
          />
        </div>
        <div className="text-base p-2.5">
          <h3 className="text-lg mb-1.5 mt-0 font-normal">{projects[1].name}</h3>
          <p className="text-xs text-gray-400 md:text-sm">{projects[1].description}</p>
          <p className="text-xs text-gray-500 mt-2.5 mb-2.5 md:text-sm">{projects[1].year}</p>
        </div>
      </div>
    </div>
  );
};