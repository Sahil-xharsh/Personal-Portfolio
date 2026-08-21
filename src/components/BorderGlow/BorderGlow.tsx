import React, { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';

export interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  borderWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  glowFilter?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x: number) {
  return x * x * x;
}

interface AnimateOpts {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts) {
  let isCancelled = false;
  let rafId: number | null = null;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const t0 = performance.now() + delay;
  function tick() {
    if (isCancelled) return;
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else if (onEnd) {
      onEnd();
    }
  }

  timerId = setTimeout(() => {
    if (!isCancelled) {
      rafId = requestAnimationFrame(tick);
    }
  }, delay);

  return () => {
    isCancelled = true;
    if (timerId) clearTimeout(timerId);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 55,
  borderWidth = 2,
  backgroundColor = '#000000',
  borderRadius = 10,
  coneSpread = 20,
  animated = true,
  colors = ['#df9b8c', '#c68477', '#ab6e62', '#74483F'],
  glowFilter,
  style = {},
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const { width, height } = el.getBoundingClientRect();
      const distToLeft = x;
      const distToRight = width - x;
      const distToTop = y;
      const distToBottom = height - y;
      const minDistance = Math.min(distToLeft, distToRight, distToTop, distToBottom);

      const maxEdgeDistance = edgeSensitivity;
      if (minDistance >= maxEdgeDistance) {
        return 0;
      }
      if (minDistance <= 0) {
        return 1;
      }
      return 1 - minDistance / maxEdgeDistance;
    },
    [edgeSensitivity]
  );

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      if (dx === 0 && dy === 0) return 0;
      const radians = Math.atan2(dy, dx);
      let degrees = radians * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
      return degrees;
    },
    [getCenterOfElement]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setEdgeProximity(getEdgeProximity(card, x, y));
      setCursorAngle(getCursorAngle(card, x, y));
    },
    [getEdgeProximity, getCursorAngle]
  );

  useEffect(() => {
    if (!animated) return;
    const card = cardRef.current;
    if (!card) return;

    let observer: IntersectionObserver | null = null;
    const cancelFns: (() => void)[] = [];
    let hasTriggered = false;

    const startSweepAnimation = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      const angleStart = 110;
      const angleEnd = 465;
      setSweepActive(true);
      setCursorAngle(angleStart);

      cancelFns.push(animateValue({ duration: 500, onUpdate: (v) => setEdgeProximity(v / 100) }));
      cancelFns.push(
        animateValue({
          ease: easeInCubic,
          duration: 1500,
          end: 50,
          onUpdate: (v) => {
            setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
          },
        })
      );
      cancelFns.push(
        animateValue({
          ease: easeOutCubic,
          delay: 1500,
          duration: 2250,
          start: 50,
          end: 100,
          onUpdate: (v) => {
            setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
          },
        })
      );
      cancelFns.push(
        animateValue({
          ease: easeInCubic,
          delay: 2500,
          duration: 1500,
          start: 100,
          end: 0,
          onUpdate: (v) => setEdgeProximity(v / 100),
          onEnd: () => setSweepActive(false),
        })
      );
    };

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            startSweepAnimation();
            if (observer) {
              observer.disconnect();
              observer = null;
            }
          }
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -30px 0px',
        }
      );
      observer.observe(card);
    } else {
      startSweepAnimation();
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      cancelFns.forEach((fn) => fn());
    };
  }, [animated]);

  const isVisible = (isHovered && edgeProximity > 0) || sweepActive;
  const borderOpacity = isVisible ? Math.min(edgeProximity * 1.25, 1) : 0;

  const meshGradients = buildMeshGradients(colors);
  const angleDeg = `${cursorAngle.toFixed(3)}deg`;

  const c0 = colors[0] || '#ffd2c9';
  const c1 = colors[1] || '#e89e90';
  const c2 = colors[2] || '#c68477';
  const c3 = colors[3] || '#74483F';

  const dynamicConic = `conic-gradient(from ${angleDeg} at center, ${c0} 0%, ${c1} 14%, ${c2} 28%, ${c3} 42%, transparent 55%, transparent 65%, ${c3} 72%, ${c2} 86%, ${c0} 100%) border-box`;
  const borderBg = [dynamicConic, ...meshGradients.map((g) => `${g} border-box`)];

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setEdgeProximity(0);
      }}
      onClick={onClick}
      className={`relative grid isolate ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        ...style,
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1]"
        style={{
          border: `${borderWidth}px solid transparent`,
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: borderOpacity,
          filter: glowFilter || 'drop-shadow(0 0 3px rgba(232, 158, 144, 0.85)) drop-shadow(0 0 7px rgba(116, 72, 63, 0.45))',
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 16
            }%, transparent ${100 - coneSpread - 16}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 16
            }%, transparent ${100 - coneSpread - 16}%, black ${100 - coneSpread}%)`,
          transition: isVisible ? 'opacity 0.12s ease-out' : 'opacity 0.35s ease-in-out',
        }}
      />

      <div className="flex flex-col relative w-full z-[2]">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
