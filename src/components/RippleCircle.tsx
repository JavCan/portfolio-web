import { useRef, useEffect, useCallback } from 'react';

interface RippleCircleProps {
  size?: number;
  colorFrom?: string;
  colorTo?: string;
  children?: React.ReactNode;
}

export default function RippleCircle({
  size = 200,
  colorFrom = '#ffffff',
  colorTo = '#ff3399',
  children,
}: RippleCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const s = useRef({
    ripples: [] as { x: number; y: number; r: number }[],
    animId: 0,
    isHovered: false,
    leaving: false,
    fillAlpha: 0,
    maxReach: 0,
  });

  const alphaHex = (alpha: number) =>
    Math.round(Math.max(0, Math.min(1, alpha)) * 255)
      .toString(16)
      .padStart(2, '0');

  const fillCircle = useCallback(
    (ctx: CanvasRenderingContext2D, color: string) => {
      const R = size / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(R, R, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
    },
    [size]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const R = size / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(R, R, R, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = colorFrom;
    ctx.fillRect(0, 0, size, size);

    if (s.current.leaving) {
      if (s.current.fillAlpha > 0) {
        ctx.fillStyle = colorTo + alphaHex(s.current.fillAlpha);
        ctx.fillRect(0, 0, size, size);
        ctx.restore();
        s.current.fillAlpha = Math.max(0, s.current.fillAlpha - 0.05);
        s.current.animId = requestAnimationFrame(draw);
      } else {
        ctx.restore();
        s.current.animId = 0;
      }
      return;
    }

    s.current.ripples.forEach(rip => {
      s.current.fillAlpha = Math.min(rip.r / s.current.maxReach, 1);
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.fillStyle = colorTo;
      ctx.fill();
    });

    ctx.restore();

    let alive = false;
    s.current.ripples = s.current.ripples.filter(rip => {
      rip.r += s.current.maxReach * 0.045;
      if (rip.r < s.current.maxReach * 1.1) { alive = true; return true; }
      return false;
    });

    if (alive) {
      s.current.animId = requestAnimationFrame(draw);
    } else {
      s.current.fillAlpha = 1;
      fillCircle(canvas.getContext('2d')!, colorTo);
      s.current.animId = 0;
    }
  }, [size, colorFrom, colorTo, fillCircle]);

  const onEnter = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const corners: [number, number][] = [[0, 0], [size, 0], [0, size], [size, size]];
      s.current.maxReach =
        Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - mx, cy - my))) + 10;
      s.current.isHovered = true;
      s.current.leaving = false;
      s.current.ripples = [{ x: mx, y: my, r: 0 }];
      if (s.current.animId) cancelAnimationFrame(s.current.animId);
      s.current.animId = requestAnimationFrame(draw);
    },
    [size, draw]
  );

  const onLeave = useCallback(() => {
    s.current.isHovered = false;
    s.current.leaving = true;
    s.current.ripples = [];
    if (s.current.animId) cancelAnimationFrame(s.current.animId);
    s.current.animId = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = size;
    canvas.height = size;
    fillCircle(canvas.getContext('2d')!, colorFrom);
    return () => cancelAnimationFrame(s.current.animId);
  }, [size, colorFrom, fillCircle]);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'default',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      {children && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}