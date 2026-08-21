import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useAnimationFrame } from 'motion/react';
import './ShinyText.css';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 6,
  className = '',
  color = '#8e8e8e',
  shineColor = '#ffffff',
  spread = 125,
  yoyo = true,
  pauseOnHover = false,
  direction = 'left',
  delay = 0.8
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = (speed || 6) * 1000;
  const delayDuration = (delay || 0) * 1000;

  useEffect(() => {
    const el = spanRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInView(entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((time) => {
    if (disabled || isPaused || !isInView || !spanRef.current) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    let rawProgress = 0;

    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration;
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        rawProgress = cycleTime / animationDuration;
      } else if (cycleTime < cycleDuration) {
        rawProgress = 1;
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration;
        rawProgress = 1 - (reverseTime / animationDuration);
      } else {
        rawProgress = 0;
      }
    } else {
      const cycleDuration = animationDuration + delayDuration;
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < animationDuration) {
        rawProgress = cycleTime / animationDuration;
      } else {
        rawProgress = 1;
      }
    }

    const smoothEased = (1 - Math.cos(rawProgress * Math.PI)) / 2;

    const normalizedProgress = direction === 'left' ? smoothEased : 1 - smoothEased;
    const bgPos = 220 - normalizedProgress * 440;

    spanRef.current.style.backgroundPosition = `${bgPos}% 0%`;
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 30%, ${shineColor} 50%, ${color} 70%, ${color} 100%)`,
    backgroundSize: '280% 100%',
    backgroundPosition: '220% 0%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    display: 'inline-block',
    willChange: 'background-position'
  };

  return (
    <motion.span
      ref={spanRef}
      className={`shiny-text inline-block ${className}`}
      style={gradientStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
