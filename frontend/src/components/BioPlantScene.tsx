import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Wind, Eye, Zap } from 'lucide-react';

interface BioPlantSceneProps {
  surgeActive?: boolean;
  onSurgeComplete?: () => void;
  height?: number | string;
  showControls?: boolean;
  isBackground?: boolean;
}

export const BioPlantScene: React.FC<BioPlantSceneProps> = ({
  surgeActive = false,
  onSurgeComplete,
  height = 360,
  showControls = false,
  isBackground = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windStrength, setWindStrength] = useState(1.0);
  const [glowIntensity, setGlowIntensity] = useState(1.0);
  const [interactiveMouse, setInteractiveMouse] = useState(true);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const surgeRingRef = useRef<{ radius: number; alpha: number; active: boolean }>({
    radius: 0,
    alpha: 0,
    active: false
  });

  useEffect(() => {
    if (surgeActive) {
      surgeRingRef.current = { radius: 10, alpha: 1.0, active: true };
    }
  }, [surgeActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particles / Spores
    const sporesCount = isBackground ? 75 : 45;
    const spores = Array.from({ length: sporesCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -0.2 - Math.random() * 0.6,
      size: 1 + Math.random() * 2.5,
      baseAlpha: 0.15 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      depth: 0.3 + Math.random() * 0.7
    }));

    // Grass blades for horizon
    const grassCount = isBackground ? 140 : 90;
    const grassBlades = Array.from({ length: grassCount }, (_, i) => ({
      x: (i / grassCount),
      height: (isBackground ? 35 : 45) + Math.random() * 55,
      lean: (Math.random() - 0.5) * 16,
      phase: Math.random() * Math.PI * 2,
      width: 2.0 + Math.random() * 2.0,
      layer: Math.random() > 0.5 ? 2 : 1
    }));

    const render = () => {
      time += 0.015 * windStrength;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Ambient Volumetric Radial Glows
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.75, 50, w * 0.5, h * 0.75, Math.max(w, h) * 0.85);
      bgGrad.addColorStop(0, 'rgba(22, 56, 50, 0.45)');
      bgGrad.addColorStop(0.4, 'rgba(11, 43, 38, 0.25)');
      bgGrad.addColorStop(1, 'rgba(2, 13, 14, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Ambient Eco-spores / Floating Fireflies
      spores.forEach((s) => {
        s.y += s.vy;
        s.x += s.vx + Math.sin(time + s.phase) * 0.4 * windStrength;

        if (interactiveMouse && mouseRef.current.active) {
          const dx = s.x - mouseRef.current.x;
          const dy = s.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            s.x += (dx / dist) * 1.8;
            s.y += (dy / dist) * 1.8;
          }
        }

        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;

        const pulseAlpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(time * 2 + s.phase)) * glowIntensity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(187, 244, 81, ${pulseAlpha})`;
        ctx.shadowColor = '#bbf451';
        ctx.shadowBlur = 8 * glowIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Terrain undulating wave at base
      const groundY = h * 0.92;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, groundY);
      for (let x = 0; x <= w; x += 30) {
        const waveY = groundY + Math.sin(x * 0.005 + time) * 12 + Math.cos(x * 0.012 + time * 0.5) * 6;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      const terrainGrad = ctx.createLinearGradient(0, groundY - 20, 0, h);
      terrainGrad.addColorStop(0, 'rgba(11, 43, 38, 0.4)');
      terrainGrad.addColorStop(1, 'rgba(2, 13, 14, 0.7)');
      ctx.fillStyle = terrainGrad;
      ctx.fill();

      // 4. Swaying Grass Blades at Horizon Base
      grassBlades.forEach((blade) => {
        const bx = blade.x * w;
        const sway = Math.sin(time * 1.3 + blade.phase) * (blade.lean + 10 * windStrength);
        const by = groundY + Math.sin(bx * 0.005 + time) * 10;

        ctx.beginPath();
        ctx.moveTo(bx - blade.width / 2, by);
        ctx.quadraticCurveTo(
          bx + sway * 0.5,
          by - blade.height * 0.55,
          bx + sway,
          by - blade.height
        );
        ctx.quadraticCurveTo(
          bx + sway * 0.6 + blade.width / 2,
          by - blade.height * 0.5,
          bx + blade.width / 2,
          by
        );
        ctx.closePath();

        const grassGrad = ctx.createLinearGradient(bx, by, bx + sway, by - blade.height);
        if (blade.layer === 2) {
          grassGrad.addColorStop(0, 'rgba(11, 43, 38, 0.6)');
          grassGrad.addColorStop(0.5, 'rgba(22, 56, 50, 0.5)');
          grassGrad.addColorStop(1, 'rgba(187, 244, 81, 0.45)');
        } else {
          grassGrad.addColorStop(0, 'rgba(5, 31, 32, 0.5)');
          grassGrad.addColorStop(0.6, 'rgba(35, 83, 71, 0.4)');
          grassGrad.addColorStop(1, 'rgba(74, 222, 128, 0.35)');
        }

        ctx.fillStyle = grassGrad;
        ctx.fill();
      });

      // 5. Energy Surge Pulse Ring
      if (surgeRingRef.current.active) {
        const ring = surgeRingRef.current;
        ring.radius += 8;
        ring.alpha -= 0.015;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(w / 2, h * 0.7, ring.radius, ring.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(187, 244, 81, ${Math.max(0, ring.alpha)})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#bbf451';
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.restore();

        if (ring.alpha <= 0 || ring.radius > Math.max(w, h)) {
          ring.active = false;
          if (onSurgeComplete) onSurgeComplete();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [windStrength, glowIntensity, interactiveMouse, onSurgeComplete, isBackground]);

  if (isBackground) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: 24,
      overflow: 'hidden',
      border: '1px solid rgba(187, 244, 81, 0.25)',
      background: 'radial-gradient(ellipse at 50% 100%, rgba(11, 43, 38, 0.8) 0%, rgba(2, 13, 14, 0.95) 100%)',
      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(218, 241, 222, 0.15)'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: interactiveMouse ? 'crosshair' : 'default'
        }}
      />
    </div>
  );
};
