import { useState, useEffect } from 'react';

// CLIENT-ONLY MOUNT HELPER
export const useMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted;
};

// SEEDED PRNG (Mulberry32) - deterministic for session
export const seededRandom = (seed: number) => {
  let a = seed;
  return function(): number {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

// BUILD STARS (exactly 10, sizes in 4/4/2 proportion, twinkle 3.2-3.6s, drift 60-120s)
export const buildStars = (count: number = 10, seed: number): Array<{
  id: number;
  x: number;
  y: number;
  size: 'sm' | 'md' | 'lg';
  twinkleDur: number;
  driftDur: number;
  dx: number;
  dy: number;
}> => {
  const rng = seededRandom(seed);
  const stars = [];
  
  // Size distribution: 4 sm, 4 md, 2 lg
  const sizes: ('sm' | 'md' | 'lg')[] = [
    'sm', 'sm', 'sm', 'sm',
    'md', 'md', 'md', 'md', 
    'lg', 'lg'
  ];
  
  for (let i = 0; i < count; i++) {
    const twinkleDur = 3.2 + rng() * 0.4; // 3.2-3.6s
    const shouldDrift = rng() > 0.5;
    const driftDur = shouldDrift ? 60 + rng() * 60 : 0; // 60-120s or 0
    
    stars.push({
      id: i,
      x: 5 + rng() * 90, // 5-95% to avoid edges
      y: 5 + rng() * 90, // 5-95% to avoid edges
      size: sizes[i] || 'sm',
      twinkleDur,
      driftDur,
      dx: shouldDrift ? (rng() - 0.5) * 50 : 0, // -25 to +25px
      dy: shouldDrift ? (rng() - 0.5) * 50 : 0  // -25 to +25px
    });
  }
  
  return stars;
};

// HERO PROGRESS (0..1 within hero section) - LEGACY FUNCTION KEPT
export const heroProgress = (heroEl: HTMLElement): number => {
  const rect = heroEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Progress from 0 (top of hero in view) to 1 (hero completely scrolled past)
  if (rect.bottom <= 0) return 1; // Hero is above viewport
  if (rect.top >= viewportHeight) return 0; // Hero is below viewport
  
  // Calculate progress based on how much of hero has scrolled out of view
  const progress = Math.max(0, -rect.top) / rect.height;
  return Math.min(1, progress);
};

// SCROLL LOCK/UNLOCK
export const lockScroll = (): void => {
  document.body.classList.add('scroll-locked');
};

export const unlockScroll = (): void => {
  document.body.classList.remove('scroll-locked');
};

// SCROLL BINDING WITH RAF
export const bindScroll = (handler: () => void): (() => void) => {
  let ticking = false;
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
};

// INTERSECTION OBSERVER HELPER
export const observe = (
  el: Element, 
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): (() => void) => {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(el);
  
  return () => {
    observer.unobserve(el);
    observer.disconnect();
  };
};

// POINTER AURA + TAP RIPPLE
export const usePointerAura = (color: string = 'var(--brand)'): void => {
  const mounted = useMounted();
  
  useEffect(() => {
    if (!mounted) return;
    
    // Desktop cursor aura
    let aura: HTMLDivElement | null = null;
    let mousePosition = { x: 0, y: 0 };
    let isVisible = false;
    
    const createAura = () => {
      aura = document.createElement('div');
      aura.className = 'pointer-aura';
      aura.style.cssText = `
        position: fixed;
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, ${color}10 0%, ${color}05 30%, transparent 60%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.3s ease;
        opacity: 0;
      `;
      document.body.appendChild(aura);
    };
    
    const updateAura = () => {
      if (aura && isVisible) {
        aura.style.left = `${mousePosition.x - 70}px`;
        aura.style.top = `${mousePosition.y - 70}px`;
      }
      requestAnimationFrame(updateAura);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        isVisible = true;
        if (aura) aura.style.opacity = '1';
      }
    };
    
    const handleMouseLeave = () => {
      isVisible = false;
      if (aura) aura.style.opacity = '0';
    };
    
    // Mobile tap ripple
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const ripple = document.createElement('div');
      ripple.className = 'mobile-tap-ripple';
      ripple.style.cssText = `
        position: fixed;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, ${color}45 0%, ${color}25 35%, transparent 75%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${touch.clientX - 30}px;
        top: ${touch.clientY - 30}px;
        animation: tapRipple 0.6s ease-out forwards;
      `;
      
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        document.body.removeChild(ripple);
      }, 600);
    };
    
    // Add CSS animation for tap ripple
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tapRipple {
        0% { transform: scale(0); opacity: 0.8; }
        100% { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Setup
    if (window.matchMedia('(hover: hover)').matches) {
      createAura();
      updateAura();
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }
    
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      if (aura && document.body.contains(aura)) {
        document.body.removeChild(aura);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      document.head.removeChild(style);
    };
  }, [mounted, color]);
};

// WHIP BLUR EFFECT
export const whipBlur = (direction: 'up' | 'down', ms: number = 350): void => {
  const body = document.body;
  const className = `whip-blur-${direction}`;
  
  body.classList.add(className);
  
  setTimeout(() => {
    body.classList.remove(className);
  }, ms);
};

// ================== NEW REALTIME HELPERS ==================

export function lerp(current: number, target: number, alpha = 0.18) {
  return current + (target - current) * alpha;
}

export function heroProgressRealtime(heroEl: HTMLElement) {
  const rect = heroEl.getBoundingClientRect();
  const heroH = Math.max(1, rect.height);
  const scrolled = -rect.top; // px scrolled past hero top
  const p = scrolled / heroH;
  return Math.max(0, Math.min(1, p));
}

/**
 * Start a continuous rAF loop. It samples hero rect each frame and calls onUpdate(p)
 * even during inertial/momentum scroll. Optionally applies light smoothing via lerp.
 */
export function startRealtimeHeroLoop(
  heroEl: HTMLElement,
  onUpdate: (p: number) => void,
  opts: { smooth?: boolean; easing?: number } = {}
){
  let rafId = 0;
  let running = true;
  let smoothed = 0;

  const tick = () => {
    if (!running) return;
    const target = heroProgressRealtime(heroEl);
    if (opts.smooth) {
      const a = typeof opts.easing === 'number' ? opts.easing : 0.20;
      smoothed = lerp(smoothed, target, a);
      onUpdate(smoothed);
    } else {
      onUpdate(target);
    }
    rafId = window.requestAnimationFrame(tick);
  };

  // keep the loop alive; no dependency on scroll events to run
  rafId = window.requestAnimationFrame(tick);

  // optional: stop when tab hidden to save CPU, resume when visible
  const onVis = () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  };
  document.addEventListener('visibilitychange', onVis);

  return () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('visibilitychange', onVis);
  };
}