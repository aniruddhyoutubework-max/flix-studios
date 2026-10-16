import React, { useEffect, useRef } from 'react';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Minecraft-style square particles (drifting upwards like beacon / enchanting table glyphs)
    const particleCount = 45; // lightweight, zero lag
    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
      flickerSpeed: number;
    }[] = [];

    const colors = [
      '#00D2FF', // Diamond Cyan
      '#38BDF8', // Sky Blue
      '#8B5CFF', // Nether Portal Purple
      '#10B981', // Emerald Green
      '#F8FAFC', // White star
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.floor(Math.random() * 4) + 2, // 2px to 5px pixel squares
        speedY: -(Math.random() * 0.4 + 0.15), // drifting gently upwards
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        flickerSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Render loop
    let tick = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      tick++;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle Minecraft grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 48; // Minecraft block grid size

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw floating square Minecraft particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Oscillate opacity gently
        p.opacity += Math.sin(tick * p.flickerSpeed) * 0.01;
        p.opacity = Math.max(0.15, Math.min(0.85, p.opacity));

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Draw crisp pixel block
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

        // Optional tiny glow on diamond cyan particles
        if (p.color === '#00D2FF' && p.size >= 4) {
          ctx.fillStyle = 'rgba(0, 210, 255, 0.2)';
          ctx.fillRect(Math.floor(p.x) - 1, Math.floor(p.y) - 1, p.size + 2, p.size + 2);
        }
      }

      ctx.globalAlpha = 1.0;
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
