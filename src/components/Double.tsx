import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  src: string;
  videoUrl?: string;
  audioUrl?: string;
  type: 'video' | 'photo' | 'text' | 'audio';
  name: string;
  caption: string;
  date: string;
  content?: string; // For text posts
  _id?: string;
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
  const [fullscreenVideo, setFullscreenVideo] = useState<Project | null>(null);
  const [fullscreenAudio, setFullscreenAudio] = useState<Project | null>(null);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<Project | null>(null);
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
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleProjectClick = (project: Project) => {
    if (project.type === 'video' && project.videoUrl) {
      setFullscreenVideo(project);
    } else if (project.type === 'audio' && project.audioUrl) {
      setFullscreenAudio(project);
    } else if (project.type === 'photo') {
      setFullscreenPhoto(project);
    }
  };

  const closeFullscreenVideo = () => {
    setFullscreenVideo(null);
  };

  const closeFullscreenAudio = () => {
    setFullscreenAudio(null);
  };

  const closeFullscreenPhoto = () => {
    setFullscreenPhoto(null);
  };

  const renderProjectContent = (project: Project, projectIndex: number, videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (!project || !project.type) {
      return null;
    }

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
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hoveredProject === projectIndex ? 'opacity-100' : 'opacity-0'
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

      case 'photo':
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
    <>
      <div
        onMouseMove={manageMouseMove}
        className="flex mt-20 h-auto md:flex-row flex-col"
      >
        <div
          ref={firstImage}
          className="w-full md:w-2/3 transition-all duration-500 ease-out cursor-pointer"
          onMouseEnter={() => {
            handleVideoHover(0, true);
            onContentHover?.(true);
          }}
          onMouseLeave={() => {
            handleVideoHover(0, false);
            onContentHover?.(false);
          }}
          onClick={() => handleProjectClick(projects[0])}
        >
          <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66%' }}>
            {renderProjectContent(projects[0], 0, firstVideo)}
          </div>
          <div className="text-base p-2.5">
            <h3 className="text-lg mb-1.5 text-black mt-0 font-medium">{projects[0].name}</h3>
            <p className="text-sm m-0 text-black">{projects[0].caption}</p>
            <p className="text-sm m-0 text-gray-500 mt-2.5 mb-2.5" style={{ marginTop: '6px' }}>{projects[0].date}</p>
          </div>
        </div>

        {projects[1] && (
          <div
            ref={secondImage}
            className="w-full md:w-1/3 transition-all duration-500 ease-out cursor-pointer"
            onMouseEnter={() => {
              handleVideoHover(1, true);
              onContentHover?.(true);
            }}
            onMouseLeave={() => {
              handleVideoHover(1, false);
              onContentHover?.(false);
            }}
            onClick={() => handleProjectClick(projects[1])}
          >
            <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66%' }}>
              {renderProjectContent(projects[1], 1, secondVideo)}
            </div>
            <div className="text-base p-2.5">
              <h3 className="text-lg mb-1.5 text-black mt-0 font-medium">{projects[1].name}</h3>
              <p className="text-xs text-black md:text-sm">{projects[1].caption}</p>
              <p className="text-xs text-gray-500 mt-4 mb-2.5 md:text-sm" style={{ marginTop: '6px' }}>{projects[1].date}</p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Video Player Modal */}
      <AnimatePresence>
        {fullscreenVideo && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeFullscreenVideo}
          >
            <motion.div
              className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeFullscreenVideo}
                className="absolute top-4 right-4 z-10 text-white text-3xl hover:text-gray-300 transition-colors duration-200"
                style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
              >
                ✕
              </button>

              {/* Video Player */}
              <video
                className="w-full h-full object-contain"
                controls
                autoPlay
                src={fullscreenVideo.videoUrl}
                style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              >
                <source src={fullscreenVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Info */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-medium mb-1">{fullscreenVideo.name}</h3>
                <p className="text-sm opacity-80">{fullscreenVideo.caption}</p>
                <p className="text-xs opacity-60 mt-1">{fullscreenVideo.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Audio Player Modal */}
      <AnimatePresence>
        {fullscreenAudio && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeFullscreenAudio}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{paddingTop: '16px'}}
            >
              {/* Close Button */}
              <button
                onClick={closeFullscreenAudio}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
              >
                ✕
              </button>

              {/* Audio Player Content */}
              <div className="text-center">
                {/* Cover Image */}
                <div className="absolute top-4 left-4">
                  <Image
                    src="/icons/audio.svg"
                    alt="Picture"
                    width={60}
                    height={48}
                    className="mb-4 group-hover:scale-110 transition-transform duration-100"
                  />
                </div>

                {/* Track Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{fullscreenAudio.name}</h2>
                  <p className="text-gray-600 mb-1">{fullscreenAudio.caption}</p>
                  <p className="text-sm text-gray-500">{fullscreenAudio.date}</p>
                </div>

                {/* Audio Player */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <audio
                    className="w-full"
                    controls
                    autoPlay
                    src={fullscreenAudio.audioUrl}
                    style={{ outline: 'none' }}
                  >
                    <source src={fullscreenAudio.audioUrl} type="audio/mpeg" />
                    <source src={fullscreenAudio.audioUrl} type="audio/mp4" />
                    <source src={fullscreenAudio.audioUrl} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* Additional Content */}
                {fullscreenAudio.content && (
                  <div className="mt-6 text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{fullscreenAudio.content}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Viewer Modal */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div 
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeFullscreenPhoto}
          >
            <motion.div 
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeFullscreenPhoto}
                className="absolute top-4 right-4 z-10 text-white text-3xl hover:text-gray-300 transition-colors duration-200"
                style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
              >
                ✕
              </button>
              
              {/* Main Photo */}
              <img
                src={fullscreenPhoto.src}
                alt={fullscreenPhoto.name}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              />
              
              {/* Photo Info */}
              <div className="absolute bottom-4 left-4 text-white max-w-md">
                <h3 className="text-lg font-medium mb-1">{fullscreenPhoto.name}</h3>
                <p className="text-sm opacity-80 mb-1">{fullscreenPhoto.caption}</p>
                <p className="text-xs opacity-60">{fullscreenPhoto.date}</p>
                {fullscreenPhoto.content && (
                  <p className="text-sm opacity-70 mt-2 leading-relaxed">{fullscreenPhoto.content}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};