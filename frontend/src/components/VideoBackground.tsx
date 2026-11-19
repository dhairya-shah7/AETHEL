import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  surgeActive?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ surgeActive = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  // Luminous subtle particle overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spores = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.15 - Math.random() * 0.4,
      size: 1 + Math.random() * 2.2,
      baseAlpha: 0.16 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2
    }));

    const render = () => {
      time += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      spores.forEach((s) => {
        s.y += s.vy;
        s.x += s.vx + Math.sin(time + s.phase) * 0.3;

        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;

        const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(time * 2 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(187, 244, 81, ${alpha})`;
        ctx.shadowColor = '#bbf451';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (surgeActive) {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, (time * 140) % (w * 0.8), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(187, 244, 81, 0.35)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [surgeActive]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* 1. Full-Brightness Cloud Forest Datacenter Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        key="aethel-clean-video"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          filter: 'brightness(1.10) contrast(1.05) saturate(1.15)',
          display: 'block'
        }}
      >
        <source src="/videos/datacenter_bright_slow.mp4" type="video/mp4" />
        <source src="/videos/datacenter_conservatory.mp4" type="video/mp4" />
        <source src="/videos/datacenter_night_slow.mp4" type="video/mp4" />
      </video>

      {/* 2. Soft Semi-Transparent Emerald Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(2, 13, 14, 0.20) 0%, rgba(5, 31, 32, 0.48) 70%, rgba(2, 13, 14, 0.72) 100%)',
        backdropFilter: 'blur(0.5px)'
      }} />

      {/* 3. Luminous Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
