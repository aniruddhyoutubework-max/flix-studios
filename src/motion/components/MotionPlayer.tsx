import React, { useRef, useState, useEffect } from 'react';
import { MotionScene } from '../types';

interface MotionPlayerProps {
  scene: MotionScene;
  aspectRatio?: string;
  className?: string;
}

export const MotionPlayer: React.FC<MotionPlayerProps> = ({
  scene,
  aspectRatio = '16/9',
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [useVideo, setUseVideo] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);

  const videoSrcMp4 = `/motion/${scene.id}.mp4`;
  const videoSrcWebm = `/motion/${scene.id}.webm`;
  const posterSrc = `/motion/${scene.id}-poster.png`;

  // Pause playback when scrolled out of view for performance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Canvas Fallback Render Loop (only active if video file is missing or fails)
  useEffect(() => {
    if (useVideo && !videoError) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let currentFrame = 0;
    let lastTime = performance.now();
    const frameMs = 1000 / scene.fps;

    const tick = (now: number) => {
      const delta = now - lastTime;
      if (delta >= frameMs && isIntersecting) {
        currentFrame = (currentFrame + 1) % scene.durationInFrames;
        lastTime = now;

        const progress = currentFrame / scene.durationInFrames;
        const time = currentFrame / scene.fps;

        scene.render({
          ctx,
          width: canvas.width,
          height: canvas.height,
          frame: currentFrame,
          totalFrames: scene.durationInFrames,
          time,
          progress,
          fps: scene.fps,
        });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [useVideo, videoError, isIntersecting, scene]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden border border-white/10 bg-[#08090B] shadow-2xl ${className}`}
      style={{ aspectRatio }}
    >
      {useVideo && !videoError ? (
        <video
          ref={videoRef}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            console.info(`[MotionPlayer] Video fallback to canvas for ${scene.id}`);
            setVideoError(true);
          }}
          className="w-full h-full object-cover block"
        >
          <source src={videoSrcWebm} type="video/webm" />
          <source src={videoSrcMp4} type="video/mp4" />
        </video>
      ) : (
        <canvas
          ref={canvasRef}
          width={scene.width}
          height={scene.height}
          className="w-full h-full object-cover block"
        />
      )}
    </div>
  );
};
