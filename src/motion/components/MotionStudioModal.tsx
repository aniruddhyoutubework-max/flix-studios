import React, { useState, useRef, useEffect } from 'react';
import { HeroScene } from '../scenes/HeroScene';
import { FlixCoreArchitectureScene } from '../scenes/FlixCoreArchitectureScene';
import { ProcessRadarScene } from '../scenes/ProcessRadarScene';
import { MotionScene } from '../types';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Camera,
  Film,
  Code2,
  CheckCircle,
} from 'lucide-react';

interface MotionStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSceneId?: string;
}

const ALL_SCENES: MotionScene[] = [HeroScene, FlixCoreArchitectureScene, ProcessRadarScene];

export const MotionStudioModal: React.FC<MotionStudioModalProps> = ({
  isOpen,
  onClose,
  initialSceneId,
}) => {
  const [selectedScene, setSelectedScene] = useState<MotionScene>(() => {
    return ALL_SCENES.find((s) => s.id === initialSceneId) || ALL_SCENES[0];
  });

  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameAccumulatorRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (initialSceneId) {
      const match = ALL_SCENES.find((s) => s.id === initialSceneId);
      if (match) setSelectedScene(match);
    }
  }, [initialSceneId]);

  // Main render loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = (f: number) => {
      const progress = f / selectedScene.durationInFrames;
      const time = f / selectedScene.fps;
      selectedScene.render({
        ctx,
        width: canvas.width,
        height: canvas.height,
        frame: f,
        totalFrames: selectedScene.durationInFrames,
        time,
        progress,
        fps: selectedScene.fps,
      });
    };

    const frameDurationMs = (1000 / selectedScene.fps) / playbackSpeed;

    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (isPlaying) {
        frameAccumulatorRef.current += delta;
        while (frameAccumulatorRef.current >= frameDurationMs) {
          setCurrentFrame((prev) => (prev + 1) % selectedScene.durationInFrames);
          frameAccumulatorRef.current -= frameDurationMs;
        }
      }

      renderFrame(currentFrame);
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen, isPlaying, currentFrame, selectedScene, playbackSpeed]);

  if (!isOpen) return null;

  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScene.id}-frame-${currentFrame}.png`;
    a.click();
  };

  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = canvas.captureStream(selectedScene.fps);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      recorder.start();
      setIsRecording(true);
      setCurrentFrame(0);
      setIsPlaying(true);

      // Auto stop after 1 full loop
      const totalDurationMs = (selectedScene.durationInFrames / selectedScene.fps) * 1000;
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, totalDurationMs + 200);
    } catch (err) {
      console.warn('Canvas recording not supported:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="bg-[#0B0C0E] border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-[#111216]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#D7FF3F]/10 text-[#D7FF3F]">
              <Film className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Motion-as-Code Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D7FF3F]/20 text-[#D7FF3F]">
                  PROCEDURAL RENDERER
                </span>
              </h3>
              <p className="text-xs text-white/50 font-mono">
                Deterministic Time-Driven Engine // {selectedScene.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scene Selector Tabs */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
          {ALL_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setSelectedScene(scene);
                setCurrentFrame(0);
                setRecordedVideoUrl(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedScene.id === scene.id
                  ? 'bg-[#D7FF3F] text-black font-bold shadow-lg shadow-[#D7FF3F]/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{scene.name}</span>
            </button>
          ))}
        </div>

        {/* Viewport Canvas */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center bg-[#08090B]">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            <canvas
              ref={canvasRef}
              width={selectedScene.width}
              height={selectedScene.height}
              className="w-full h-full object-contain block"
            />

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono text-red-400 font-bold">RECORDING FRAMES...</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Controls & Tools */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#111216] space-y-3">
          {/* Scrubber Bar */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-white/60 min-w-[70px]">
              FR {String(currentFrame).padStart(3, '0')} / {selectedScene.durationInFrames}
            </span>

            <input
              type="range"
              min={0}
              max={selectedScene.durationInFrames - 1}
              value={currentFrame}
              onChange={(e) => setCurrentFrame(parseInt(e.target.value, 10))}
              className="flex-1 accent-[#D7FF3F] cursor-pointer h-2 bg-white/15 rounded-lg"
            />

            <span className="text-xs font-mono text-[#D7FF3F] min-w-[50px] text-right">
              {((currentFrame / selectedScene.durationInFrames) * 100).toFixed(0)}%
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-lg bg-[#D7FF3F] text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#c2eb2f] transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => setCurrentFrame((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Step Back 1 Frame"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setCurrentFrame((prev) => Math.min(selectedScene.durationInFrames - 1, prev + 1))
                }
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Step Forward 1 Frame"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentFrame(0)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Reset to Frame 0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed Toggles */}
              <div className="flex items-center gap-1 ml-2 bg-black/40 p-1 rounded-lg border border-white/5">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                      playbackSpeed === s ? 'bg-white/20 text-[#D7FF3F]' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Export & Capture Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCaptureSnapshot}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>SAVE FRAME PNG</span>
              </button>

              <button
                onClick={handleRecordVideo}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#8B5CFF]/20 hover:bg-[#8B5CFF]/30 border border-[#8B5CFF]/40 text-[#8B5CFF]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isRecording ? 'STOP CAPTURE' : 'EXPORT WEBM'}</span>
              </button>

              {recordedVideoUrl && (
                <a
                  href={recordedVideoUrl}
                  download={`${selectedScene.id}.webm`}
                  className="px-3 py-1.5 rounded-lg bg-[#D7FF3F]/20 text-[#D7FF3F] border border-[#D7FF3F]/40 text-xs font-mono flex items-center gap-1.5 hover:bg-[#D7FF3F]/30 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>DOWNLOAD CLIP</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
