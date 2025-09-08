import { useState, useEffect } from 'react';
import type { Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP ScrollToPlugin (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

// CLIENT-ONLY MOUNT HELPER
export const clientOnlyMount = (): boolean => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted;
};

// SEEDED PRNG (Mulberry32) - deterministic for session
export class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// STAR GENERATOR (client-only, seeded, no SSR randoms)
export const generateStars = (count: number = 10, customSeed?: number): Array<{
  id: number;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  delay: number;
  drift: string;
}> => {
  // Get or create session seed
  let seed = customSeed || 0;
  if (typeof window !== 'undefined' && !customSeed) {
    const storedSeed = sessionStorage.getItem('claqueta-star-seed');
    if (storedSeed) {
      seed = parseInt(storedSeed, 10);
    } else {
      seed = Date.now();
      sessionStorage.setItem('claqueta-star-seed', seed.toString());
    }
  }
  
  const rng = new SeededRandom(seed);
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + rng.next() * 90, // 5-95% to avoid edges
    y: 5 + rng.next() * 90, // 5-95% to avoid edges
    size: rng.next() > 0.7 ? 'large' : rng.next() > 0.4 ? 'medium' : 'small',
    delay: rng.next() * 3,
    drift: rng.next() > 0.6 ? `star-drift-${Math.floor(rng.next() * 3) + 1}` : ''
  }));
};

// Easing functions
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  whipTilt: [0.25, 0.46, 0.45, 0.94],
  popup: [0.68, -0.55, 0.265, 1.55],
  cinematic: [0.4, 0, 0.2, 1],
  heroPopup: [0.34, 1.56, 0.64, 1]
} as const;

// Durations
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 1.0,
  letterbox: 1.2,
  cinematic: 1.4,
  heroLine: 0.8,
  bob: 6
} as const;

// Spring configurations
export const heroPopupSpring = {
  type: "spring",
  damping: 22,
  stiffness: 380,
  mass: 0.8
} as const;

// LETTERBOX ANIMATIONS
export const letterboxEnter: Variants = {
  hiddenTop: {
    y: -100,
    opacity: 1
  },
  hiddenBottom: {
    y: 100,
    opacity: 1
  },
  visibleTop: {
    y: 0,
    opacity: 1,
    transition: {
      duration: durations.letterbox,
      ease: easing.cinematic
    }
  },
  visibleBottom: {
    y: 0,
    opacity: 1,
    transition: {
      duration: durations.letterbox,
      ease: easing.cinematic
    }
  }
};

export const letterboxExit: Variants = {
  exitTop: {
    y: -100,
    opacity: 0.8,
    transition: {
      duration: 0.6,
      ease: easing.easeIn
    }
  },
  exitBottom: {
    y: 100,
    opacity: 0.8,
    transition: {
      duration: 0.6,
      ease: easing.easeIn
    }
  }
};

export const letterboxReturn: Variants = {
  returnTop: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easing.easeOut
    }
  },
  returnBottom: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easing.easeOut
    }
  }
};

// HERO LINE POPUP WITH SPRING OVERSHOOT
export const heroLinePopup: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 8
  },
  visible: (lineIndex: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...heroPopupSpring,
      delay: 1.4 + (lineIndex * 0.12),
      duration: durations.heroLine
    }
  })
};

// HERO LINE BOB (slow buoyant floating after popup)
export const heroLineBob: Variants = {
  bob: {
    y: [0, -3, 0, 2, 0],
    transition: {
      duration: durations.bob,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.3, 0.5, 0.8, 1]
    }
  }
};

// Hero container stagger
export const heroStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 2.0
    }
  }
};

// Standard animations
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easing.easeOut
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easing.easeOut
    }
  }
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easing.easeOut
    }
  }
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easing.easeOut
    }
  }
};

// Stagger containers
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Progress bar animation
export const progressBar: Variants = {
  hidden: {
    width: "0%"
  },
  visible: (percent: number) => ({
    width: `${percent}%`,
    transition: {
      duration: 1.2,
      ease: easing.easeOut,
      delay: 0.2
    }
  })
};

// Hover effects
export const hoverLift = {
  whileHover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: durations.fast,
      ease: easing.easeOut
    }
  },
  whileTap: {
    y: 0,
    scale: 0.98
  }
};

// SMOOTH SCROLL WITH DIRECTIONAL BLUR + WHIP (FIXED GSAP)
export const smoothSnapTo = async (
  target: Element | string, 
  options: {
    direction: 'up' | 'down';
    center?: boolean;
  }
): Promise<void> => {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) return;

  const { direction, center = false } = options;
  
  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    element.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const rect = element.getBoundingClientRect();
  const elementHeight = rect.height;
  const viewportHeight = window.innerHeight;
  
  let scrollTop: number;
  
  if (center || elementHeight < viewportHeight) {
    // Center short sections or when explicitly requested
    scrollTop = window.scrollY + rect.top - (viewportHeight - elementHeight) / 2;
  } else {
    // Align top with safe offset for tall sections
    scrollTop = window.scrollY + rect.top - 80;
  }

  // Apply directional motion blur
  const pageRoot = document.getElementById('pageRoot') || document.body;
  pageRoot.classList.add(`whip-blur-${direction}`);

  return new Promise<void>((resolve) => {
    // Try GSAP with ScrollToPlugin first
    if (typeof gsap !== 'undefined' && gsap.plugins?.ScrollToPlugin) {
      gsap.to(window, {
        duration: Math.min(Math.abs(scrollTop - window.scrollY) * 0.001, 1.2),
        scrollTo: { y: scrollTop, autoKill: false },
        ease: "power2.out",
        onComplete: () => {
          pageRoot.classList.remove(`whip-blur-${direction}`);
          resolve();
        }
      });
    } else {
      // Fallback to native smooth scroll with correct options
      window.scrollTo({ 
        top: scrollTop, 
        left: 0, 
        behavior: 'smooth' 
      });
      
      setTimeout(() => {
        pageRoot.classList.remove(`whip-blur-${direction}`);
        resolve();
      }, 800);
    }
  });
};

// Message entrance animations
export const messageSlideIn: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.95
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easing.easeOut,
      delay: delay * 0.3
    }
  })
};

// Typing indicator animation
export const typingDots: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: easing.easeInOut
    }
  }
};

// Timeline arrow animation
export const timelineArrow: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: easing.easeInOut,
      delay: 0.5
    }
  }
};

// Status pill width helper
export const statusPillWidth = "min-w-[80px]";

// Mobile tap ripple effect
export const tapRipple = {
  scale: [0, 1],
  opacity: [0.8, 0],
  transition: {
    duration: 0.6,
    ease: easing.easeOut
  }
};