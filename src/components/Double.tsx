import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface Project {
  src: string;
  videoUrl?: string;
  audioUrl?: string;
  type: 'video' | 'image' | 'text' | 'audio';
  name: string;
  caption: string;
  date: string;
  content?: string; // For text posts
}

interface DoubleProps {
  projects: Project[];
  reversed?: boolean;
  onContentHover?: (isHovering: boolean) => void;
}

export const Double: React.FC<DoubleProps> = ({ projects, reversed = false, onContentHover }) => {
  const firstImage = useRef<HTMLDivElement>(null);
  const secondImage = useRef<HTMLDivElement>(null);
  const firstVideo = useRef<HTMLVideoElement>(null);
  const secondVideo = useRef<HTMLVideoElement>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  let requestAnimationFrameId: number | null = null;
  let xPercent = reversed ? 100 : 0;
  let currentXPercent = reversed ? 100 : 0;
  const speed = 0.15;


  const manageMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth >= 640) {
      const { clientX } = e;
      xPercent = (clientX / window.innerWidth) * 100;

      if (!requestAnimationFrameId) {
        requestAnimationFrameId = window.requestAnimationFrame(animate);
      }
    }
  };


  const handleVideoHover = (projectIndex: number, isEntering: boolean) => {
    setHoveredProject(isEntering ? projectIndex : null);
    
    const videoRef = projectIndex === 0 ? firstVideo : secondVideo;
    
    if (videoRef.current) {
      if (isEntering && projects[projectIndex].videoUrl) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const renderProjectContent = (project: Project, projectIndex: number, videoRef: React.RefObject<HTMLVideoElement | null>) => {
    switch (project.type) {
      case 'video':
        return (
          <>
            <Image
              src={project.src}
              fill={true}
              alt={project.name}
              className="object-cover"
            />
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                hoveredProject === projectIndex ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={project.videoUrl} type="video/mp4" />
            </video>
          </>
        );
      
      case 'image':
        return (
          <Image
            src={project.src}
            fill={true}
            alt={project.name}
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        );
      
      case 'text':
        return (
          <div className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                "{project.content}"
              </p>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <>
            <Image
              src={project.src}
              fill={true}
              alt={project.name}
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
              <div className="text-center text-white">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/icons/audio.svg"
                    alt="Audio"
                    width={194}
                    height={194}
                    className="opacity-90"
                  />
                </div>
                {/* <p className="text-sm font-semibold text-white drop-shadow-lg">Audio Content</p> */}
                {project.audioUrl && (
                  <audio 
                    controls 
                    className="mt-4 w-full max-w-xs"
                    style={{ filter: 'invert(1)' }}
                  >
                    <source src={project.audioUrl} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <Image
            src={project.src}
            fill={true}
            alt={project.name}
            className="object-cover"
          />
        );
    }
  };

  const animate = () => {
    if (window.innerWidth >= 640) {
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
        onMouseEnter={() => {
          handleVideoHover(0, true);
          onContentHover?.(true);
        }}
        onMouseLeave={() => {
          handleVideoHover(0, false);
          onContentHover?.(false);
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66%' }}>
          {renderProjectContent(projects[0], 0, firstVideo)}
        </div>
        <div className="text-base p-2.5">
          <h3 className="text-lg mb-1.5 text-black mt-0 font-medium">{projects[0].name}</h3>
          <p className="text-sm m-0 text-black">{projects[0].caption}</p>
          <p className="text-sm m-0 text-gray-500 mt-2.5 mb-2.5" style={{marginTop: '6px'}}>{projects[0].date}</p>
        </div>
      </div>

      <div
        ref={secondImage}
        className="w-full md:w-1/3 transition-all duration-500 ease-out"
        onMouseEnter={() => {
          handleVideoHover(1, true);
          onContentHover?.(true);
        }}
        onMouseLeave={() => {
          handleVideoHover(1, false);
          onContentHover?.(false);
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66%' }}>
          {renderProjectContent(projects[1], 1, secondVideo)}
        </div>
        <div className="text-base p-2.5">
          <h3 className="text-lg mb-1.5 text-black mt-0 font-medium">{projects[1].name}</h3>
          <p className="text-xs text-black md:text-sm">{projects[1].caption}</p>
          <p className="text-xs text-gray-500 mt-4 mb-2.5 md:text-sm" style={{marginTop: '6px'}}>{projects[1].date}</p>
        </div>
      </div>
    </div>
  );
};