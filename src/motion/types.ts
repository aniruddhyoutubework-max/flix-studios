export interface MotionRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  frame: number;
  totalFrames: number;
  time: number; // in seconds
  progress: number; // 0 to 1
  fps: number;
}

export interface MotionScene {
  id: string;
  name: string;
  description: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  render: (context: MotionRenderContext) => void;
}

export interface MotionTimelineState {
  currentFrame: number;
  isPlaying: boolean;
  fps: number;
  durationInFrames: number;
  progress: number;
}
