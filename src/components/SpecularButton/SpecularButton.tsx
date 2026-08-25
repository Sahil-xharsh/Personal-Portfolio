import React, { useRef, useEffect, useState, type CSSProperties, type ReactNode, type MouseEventHandler } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface SpecularButtonProps {
  children?: ReactNode;
  size?: ButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const PAD = 10;

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-[0.85rem] px-[20px] py-[8px]',
  md: 'text-[1rem] px-[28px] py-[12px]',
  lg: 'text-[1.15rem] px-8 py-[16px]'
};

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  children = 'Get Started',
  size = 'md',
  radius = 14,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#c68477',
  baseColor = '#3a2824',
  intensity = 1.2,
  thickness = 1.2,
  speed = 0.35,
  followMouse = true,
  proximity = 140,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setIsHovered] = useState(false);

  useEffect(() => {
    const btn = btnRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let sizeW = 0;
    let sizeH = 0;
    let isIntersecting = false;
    let isRunning = false;
    let raf = 0;

    let pointerAngle: number | null = null;
    let proximityT = 0;
    let angle = 2.4;
    let idleAngle = 2.4;
    let bright = 0;
    let last = performance.now();

    const resize = () => {
      if (!btn || !canvas) return;
      const rect = btn.getBoundingClientRect();
      sizeW = rect.width;
      sizeH = rect.height;
      if (sizeW === 0 || sizeH === 0) return;

      canvas.width = (sizeW + PAD * 2) * dpr;
      canvas.height = (sizeH + PAD * 2) * dpr;
      canvas.style.width = `${sizeW + PAD * 2}px`;
      canvas.style.height = `${sizeH + PAD * 2}px`;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(btn);
    resize();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (autoAnimate || proximityT > 0 || bright > 0.01) {
            startLoop();
          }
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.05 });
    io.observe(btn);

    const draw = (now: number) => {
      if (!isIntersecting) {
        isRunning = false;
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      idleAngle += speed * dt;
      const steer = followMouse && pointerAngle != null && (!autoAnimate || proximityT > 0);
      const target = steer ? pointerAngle : idleAngle;
      const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 8));

      const brightTarget = autoAnimate ? 1 : proximityT;
      bright += (brightTarget - bright) * (1 - Math.exp(-dt * 9));

      if (!ctx || sizeW === 0 || sizeH === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (bright < 0.005 && !autoAnimate && proximityT === 0) {
        isRunning = false;
        return;
      }

      const cx = (PAD + sizeW / 2) * dpr;
      const cy = (PAD + sizeH / 2) * dpr;
      const halfW = (sizeW / 2) * dpr;
      const halfH = (sizeH / 2) * dpr;
      const r = Math.min(radius * dpr, Math.min(halfW, halfH));

      const lx = Math.cos(angle);
      const ly = Math.sin(angle);

      const x0 = cx - lx * halfW * 1.3;
      const y0 = cy - ly * halfH * 1.3;
      const x1 = cx + lx * halfW * 1.3;
      const y1 = cy + ly * halfH * 1.3;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(0.5, lineColor);
      grad.addColorStop(0.65, baseColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.save();
      ctx.globalAlpha = Math.min(bright * intensity, 1);
      ctx.lineWidth = thickness * dpr;
      ctx.strokeStyle = grad;
      ctx.shadowColor = lineColor;
      ctx.shadowBlur = Math.min(4 * dpr, 6);

      ctx.beginPath();
      const x = PAD * dpr;
      const y = PAD * dpr;
      const w = sizeW * dpr;
      const h = sizeH * dpr;

      if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (!isRunning && isIntersecting) {
        isRunning = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const stopLoop = () => {
      if (isRunning) {
        cancelAnimationFrame(raf);
        isRunning = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isIntersecting || !btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (cy - e.clientY) / (rect.height / 2);
        pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
      }

      const t = Math.max(0, 1 - dist / Math.max(proximity, 1));
      proximityT = t * t * (3 - 2 * t);

      if (proximityT > 0 || autoAnimate) {
        startLoop();
      }
    };

    const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    if (autoAnimate) {
      startLoop();
    }

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      if (isFinePointer) {
        window.removeEventListener('pointermove', onPointerMove);
      }
    };
  }, [radius, lineColor, baseColor, intensity, thickness, speed, followMouse, proximity, autoAnimate]);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative m-0 inline-flex cursor-pointer items-center justify-center font-medium leading-none tracking-[0.01em] outline-none select-none disabled:cursor-default disabled:opacity-55 [color:var(--sb-text-color)] [border-radius:var(--sb-radius)] [background:color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)*100%),transparent)] [backdrop-filter:blur(var(--sb-blur))] transition-all duration-200 ${className ? className : SIZES[size] || SIZES.md}`}
      style={
        {
          '--sb-radius': `${radius}px`,
          '--sb-tint': tint,
          '--sb-tint-opacity': tintOpacity,
          '--sb-blur': `${blur}px`,
          '--sb-text-color': textColor
        } as CSSProperties
      }
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[10px] z-[1] block overflow-visible will-change-transform"
      />
      <span className="relative z-[2] flex items-center">{children}</span>
    </button>
  );
};

export default SpecularButton;
