'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar,
  Camera, 
  Users, 
  FileText, 
  MapPin, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  Mail,
  Star,
  Zap,
  Globe,
  Smartphone,
  Instagram,
  Facebook
} from 'lucide-react';
import { 
  features, 
  progress, 
  roadmap, 
  changelog, 
  workflowSteps, 
  lineMessages, 
  faqData, 
  getLastUpdated 
} from './data';
import {
  clientOnlyMount,
  generateStars,
  letterboxEnter,
  letterboxExit,
  letterboxReturn,
  heroLinePopup,
  heroLineBob,
  heroStaggerContainer,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  progressBar,
  hoverLift,
  smoothSnapTo,
  messageSlideIn,
  typingDots,
  statusPillWidth,
  timelineArrow,
  navWhipTilt
} from '@/lib/anim';

// Types
interface Feature {
  key: string;
  title: string;
  description: string;
  status: 'shipped' | 'in_progress' | 'planned';
  category: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  delay: number;
  drift: string;
}

// Icon mapping for features
const featureIcons = {
  script_imports: FileText,
  script_breakdown: FileText,
  moodboard: Camera,
  locations: MapPin,
  shotlist: Camera,
  stripboard: Calendar,
  calendar: Calendar,
  contacts: Users,
  tasks: CheckCircle2,
  budget: FileText,
  notes: FileText,
  callsheets: Clock,
  schedule_daily: Clock,
  continuity: Camera,
  dailies: Play,
  deliverables: CheckCircle2,
  reports: FileText
};

// Epic Starfield component (CLIENT-ONLY, NO SSR HYDRATION ISSUES)
const EpicStarfield = () => {
  const mounted = clientOnlyMount();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (mounted) {
      setStars(generateStars(25));
    }
  }, [mounted]);

  if (!mounted || stars.length === 0) {
    // Server renders empty container, client fills after mount
    return <div className="starfield-epic" />;
  }

  return (
    <div className="starfield-epic">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.size} ${star.drift}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Cursor follower component (CLIENT-ONLY, smaller)
const CursorFollower = () => {
  const mounted = clientOnlyMount();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mounted]);

  if (!mounted || !isVisible) return null;

  return (
    <div 
      className="cursor-spotlight-small fixed pointer-events-none"
      style={{
        left: mousePosition.x - 70,
        top: mousePosition.y - 70,
      }}
    />
  );
};

// Mobile tap ripple component (CLIENT-ONLY, smaller)
const MobileTapRipple = () => {
  const mounted = clientOnlyMount();
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!mounted) return;

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      const ripple = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY
      };
      
      setRipples(prev => [...prev, ripple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600);
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="mobile-tap-ripple fixed pointer-events-none"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </>
  );
};

// Join Waitlist Modal
const JoinWaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card p-8 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Join the Waitlist</h3>
                <p className="text-[var(--text-muted)] mb-6">
                  Get notified when new features ship and beta access opens up.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    required
                  />
                  <div className="flex gap-3">
                    <button onClick={handleSubmit} className="btn btn-primary flex-1">
                      Join Waitlist
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-[var(--brand)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                <p className="text-[var(--text-muted)]">We'll keep you updated.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function LandingPage() {
  // STATE MANAGEMENT
  const [introLocked, setIntroLocked] = useState(true);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [hasSnappedToFeatures, setHasSnappedToFeatures] = useState(false);
  const [showAppbar, setShowAppbar] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [isHeroEpic, setIsHeroEpic] = useState(true);
  const [showLetterbox, setShowLetterbox] = useState(false);
  const [letterboxState, setLetterboxState] = useState<'enter' | 'exit' | 'return' | 'none'>('none');
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [atFeatures, setAtFeatures] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 800], [0, -200]);
  const grainY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // INTRO SEQUENCE LOGIC (letterbox-first)
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Check if intro has played this session
    const sessionIntroPlayed = sessionStorage.getItem('claqueta-intro-played');
    
    if (sessionIntroPlayed || prefersReducedMotion) {
      // Skip intro if already played or reduced motion
      setIntroPlayed(true);
      setHeroReady(true);
      setIntroLocked(false);
      setHeroTextVisible(true);
      if (prefersReducedMotion) {
        // Brief letterbox for reduced motion
        document.body.classList.add('scroll-locked');
        setTimeout(() => {
          document.body.classList.remove('scroll-locked');
        }, 300);
      }
      return;
    }

    // Lock scrolling during intro
    document.body.classList.add('scroll-locked');
    
    // Step 1: Show letterbox first
    setTimeout(() => {
      setShowLetterbox(true);
      setLetterboxState('enter');
    }, 200);

    // Step 2: After letterbox, show hero text line-by-line
    setTimeout(() => {
      setIntroPlayed(true);
      setHeroTextVisible(true);
    }, 1500);

    // Step 3: Complete intro and unlock scroll
    setTimeout(() => {
      setHeroReady(true);
      setIntroLocked(false);
      document.body.classList.remove('scroll-locked');
      sessionStorage.setItem('claqueta-intro-played', 'true');
    }, prefersReducedMotion ? 300 : 4000); // 4s for full intro
  }, [prefersReducedMotion]);

  // SCROLL INTERCEPTION FOR BI-DIRECTIONAL SNAP
  useEffect(() => {
    if (introLocked) return;

    const handleWheel = (e: WheelEvent) => {
      if (!hasSnappedToFeatures && e.deltaY > 0) {
        // First downward scroll → snap to features
        e.preventDefault();
        setHasSnappedToFeatures(true);
        setIsHeroEpic(false);
        setLetterboxState('exit');
        setTimeout(() => {
          setShowLetterbox(false);
          smoothSnapTo(featuresRef.current!, { direction: 'down', center: false });
        }, 200);
      } else if (atFeatures && e.deltaY < 0) {
        // At features and scrolling up → snap back to hero
        e.preventDefault();
        setIsHeroEpic(true);
        setLetterboxState('return');
        setShowLetterbox(true);
        smoothSnapTo(heroRef.current!, { direction: 'up', center: true });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const startY = e.touches[0].clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        if (!hasSnappedToFeatures && deltaY > 50) {
          // Swipe up (scroll down) → snap to features
          e.preventDefault();
          setHasSnappedToFeatures(true);
          setIsHeroEpic(false);
          setLetterboxState('exit');
          setTimeout(() => {
            setShowLetterbox(false);
            smoothSnapTo(featuresRef.current!, { direction: 'down', center: false });
          }, 200);
          
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        } else if (atFeatures && deltaY < -50) {
          // At features, swipe down (scroll up) → snap back to hero
          e.preventDefault();
          setIsHeroEpic(true);
          setLetterboxState('return');
          setShowLetterbox(true);
          smoothSnapTo(heroRef.current!, { direction: 'up', center: true });
          
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        }
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasSnappedToFeatures && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
        e.preventDefault();
        setHasSnappedToFeatures(true);
        setIsHeroEpic(false);
        setLetterboxState('exit');
        setTimeout(() => {
          setShowLetterbox(false);
          smoothSnapTo(featuresRef.current!, { direction: 'down', center: false });
        }, 200);
      } else if (atFeatures && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
        e.preventDefault();
        setIsHeroEpic(true);
        setLetterboxState('return');
        setShowLetterbox(true);
        smoothSnapTo(heroRef.current!, { direction: 'up', center: true });
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [introLocked, hasSnappedToFeatures, atFeatures]);

  // APPBAR VISIBILITY
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setShowAppbar(!entries[0].isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // FEATURES SECTION DETECTION
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setAtFeatures(entries[0].isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // SMOOTH SCROLL NAV HANDLER
  const handleNavClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      await smoothSnapTo(targetElement, { direction: 'down', center: false });
    }
  }, []);

  // HERO TEXT LINES
  const heroLines = [
    { text: "Claqueta", className: "text-[var(--brand)]" },
    { text: "Film production", className: "" },
    { text: "management", className: "" }
  ];

  return (
    <div id="pageRoot" className="min-h-screen text-[var(--text)] overflow-x-hidden relative">
      {/* SVG Filter for directional blur */}
      <svg className="svg-blur-filter">
        <defs>
          <filter id="dir-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2,1" />
            <feOffset dx="0" dy="2" result="offset" />
            <feFlood floodColor="#4CA18A" floodOpacity="0.1" />
            <feComposite in="offset" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Background wrapper with epic class toggle */}
      <div className={`fixed inset-0 transition-all duration-1000 ${isHeroEpic ? 'hero-epic-bg' : 'bg-brand-gradient'}`}>
        {/* Epic starfield (only when hero epic) */}
        {isHeroEpic && <EpicStarfield />}
        
        {/* Film Grain */}
        <motion.div 
          className="film-grain fixed inset-0 pointer-events-none z-10"
          style={{ y: grainY }}
        />
      </div>

      {/* Interactive elements */}
      <CursorFollower />
      <MobileTapRipple />

      {/* Letterbox Bars */}
      <AnimatePresence>
        {showLetterbox && (
          <>
            <motion.div 
              className={`letterbox-bar fixed top-0 left-0 right-0 h-20 z-40 ${
                letterboxState === 'enter' ? 'letterbox-enter-top' :
                letterboxState === 'exit' ? 'letterbox-exit-top' :
                letterboxState === 'return' ? 'letterbox-return-top' : ''
              }`}
            />
            <motion.div 
              className={`letterbox-bar fixed bottom-0 left-0 right-0 h-20 z-40 ${
                letterboxState === 'enter' ? 'letterbox-enter-bottom' :
                letterboxState === 'exit' ? 'letterbox-exit-bottom' :
                letterboxState === 'return' ? 'letterbox-return-bottom' : ''
              }`}
            />
          </>
        )}
      </AnimatePresence>

      {/* Sticky Appbar */}
      <AnimatePresence>
        {showAppbar && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 appbar-glass"
          >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="text-xl font-bold text-[var(--brand)]">Claqueta</div>
              <div className="appbar-nav-right">
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-[var(--brand)] transition-colors">Features</a>
                  <a href="#workflow" onClick={(e) => handleNavClick(e, 'workflow')} className="hover:text-[var(--brand)] transition-colors">Workflow</a>
                  <a href="#roadmap" onClick={(e) => handleNavClick(e, 'roadmap')} className="hover:text-[var(--brand)] transition-colors">Roadmap</a>
                  <a href="#progress" onClick={(e) => handleNavClick(e, 'progress')} className="hover:text-[var(--brand)] transition-colors">Progress</a>
                  <a href="#changelog" onClick={(e) => handleNavClick(e, 'changelog')} className="hover:text-[var(--brand)] transition-colors">Changelog</a>
                  <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-[var(--brand)] transition-colors">FAQ</a>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/hub" className="btn btn-primary btn-sm">Try the Beta</Link>
                  <button onClick={() => setShowWaitlistModal(true)} className="btn btn-secondary btn-sm">Join Waitlist</button>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 z-30"
        style={{ y: heroY }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="line-stagger md:line-stagger lg:line-stagger">
            {/* Hero Headlines - Line by Line Popup with Bob */}
            <h1 className="hero-title-epic text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              {heroLines.map((line, index) => (
                <motion.span
                  key={index}
                  className={`block ${line.className}`}
                  variants={heroLinePopup}
                  initial="hidden"
                  animate={heroTextVisible ? "visible" : "hidden"}
                  custom={index}
                  onAnimationComplete={() => {
                    // Add bob animation after popup completes
                    if (index === heroLines.length - 1) {
                      setTimeout(() => {
                        const lineElements = document.querySelectorAll('.hero-title-epic .block');
                        lineElements.forEach(el => el.classList.add('hero-line-bob'));
                      }, 500);
                    }
                  }}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            {/* Hero Subtext and Buttons - Staggered */}
            <motion.div
              variants={heroStaggerContainer}
              initial="hidden"
              animate={heroTextVisible ? "visible" : "hidden"}
            >
              <motion.p 
                variants={heroLinePopup}
                className="hero-subtitle-epic text-lg md:text-xl text-[var(--text-muted)] mb-8 max-w-2xl mx-auto"
              >
                From script breakdown to call sheets — built in public, no hype, just tools that work.
              </motion.p>

              <motion.div 
                variants={heroLinePopup}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/hub" className="btn-hero-primary btn btn-lg flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Try the Beta
                </Link>
                <button onClick={() => setShowWaitlistModal(true)} className="btn-hero-secondary btn btn-lg">
                  Join Waitlist
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Content sections with normal background */}
      <div className="relative z-30 bg-[var(--page-bg)]">
        {/* Features Grid */}
        <section id="features" ref={featuresRef} className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Built for Real Production
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Every feature serves actual filmmaking workflows. No fluff, no fake promises.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature) => {
                const Icon = featureIcons[feature.key as keyof typeof featureIcons] || FileText;
                return (
                  <motion.div
                    key={feature.key}
                    variants={fadeInUp}
                    className="card p-6 group"
                    {...hoverLift}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center group-hover:bg-[var(--brand)]/20 transition-colors flex-shrink-0">
                        <Icon className="w-6 h-6 text-[var(--brand)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <div className={`status-pill ${statusPillWidth} text-center text-xs px-2 py-1 rounded-full mb-3 ${
                          feature.status === 'shipped' ? 'bg-green-500/20 text-green-400' :
                          feature.status === 'in_progress' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {feature.status === 'shipped' ? 'Shipped' : 
                           feature.status === 'in_progress' ? 'In Progress' : 'Planned'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Complete Production Workflow */}
        <section id="workflow" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Production Workflow</h2>
              <p className="text-lg text-[var(--text-muted)]">
                Action → Output at every step
              </p>
            </motion.div>

            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-8">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.phase}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex-1 text-center relative"
                  >
                    <div className="w-16 h-16 bg-[var(--brand)]/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-xl font-bold text-[var(--brand)]">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <div className="text-sm text-[var(--text-muted)] mb-4">
                      <div className="font-medium mb-2">Actions:</div>
                      {step.actions.map((action, i) => (
                        <div key={i}>{action}</div>
                      ))}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      <div className="font-medium mb-2">Outputs:</div>
                      {step.outputs.map((output, i) => (
                        <div key={i} className="text-[var(--brand)]">{output}</div>
                      ))}
                    </div>
                    
                    {/* Connecting Arrow */}
                    {index < workflowSteps.length - 1 && (
                      <motion.svg
                        className="absolute top-8 left-full w-16 h-8 text-[var(--brand)]"
                        variants={timelineArrow}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <path
                          d="M 0 4 L 12 4 L 8 0 M 12 4 L 8 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Snap Scroll */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory">
              <div className="flex gap-6 pb-4" style={{ width: `${workflowSteps.length * 280}px` }}>
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.phase}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="w-64 snap-center card p-6"
                  >
                    <div className="w-12 h-12 bg-[var(--brand)]/20 rounded-full flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-[var(--brand)]">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
                    <div className="text-sm text-[var(--text-muted)] mb-4">
                      <div className="font-medium mb-2">Actions:</div>
                      {step.actions.map((action, i) => (
                        <div key={i} className="mb-1">{action}</div>
                      ))}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      <div className="font-medium mb-2">Outputs:</div>
                      {step.outputs.map((output, i) => (
                        <div key={i} className="text-[var(--brand)] mb-1">{output}</div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LINE Integration */}
        <section id="line" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">LINE Integration</h2>
              <p className="text-lg text-[var(--text-muted)]">
                Two-way communication with your crew
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="line-phone-mock mx-auto max-w-sm"
            >
              <div className="card rounded-[2rem] p-6 border-2 border-[var(--border)] relative">
                {/* Phone Screen Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                  <div className="w-10 h-10 bg-[var(--brand)] rounded-full flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div>
                    <div className="font-semibold">Claqueta</div>
                    <div className="text-xs text-[var(--text-muted)]">Production Bot</div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4 p-2 bg-[var(--neutral-800)]/30 rounded">
                  <Smartphone className="w-3 h-3" />
                  Simulated flow — not real messages
                </div>
                
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {lineMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      variants={messageSlideIn}
                      initial="hidden"
                      whileInView="visible"
                      custom={index}
                      viewport={{ once: true }}
                      className={`flex ${msg.sender === 'claqueta' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-3 ${
                        msg.sender === 'claqueta' 
                          ? 'bg-[var(--brand)]/20 text-[var(--text)]' 
                          : 'bg-[var(--accent)]/20 text-[var(--text)]'
                      }`}>
                        <div className="text-sm">{msg.message}</div>
                        {msg.hasAttachment && (
                          <div className="mt-2 p-2 bg-[var(--neutral-800)]/50 rounded text-xs flex items-center gap-2">
                            {msg.attachmentType === 'call_sheet' && <FileText className="w-3 h-3" />}
                            {msg.attachmentType === 'map' && <MapPin className="w-3 h-3" />}
                            {msg.attachmentType === 'call_sheet' ? 'Call Sheet PDF' : 'Map Link'}
                          </div>
                        )}
                        <div className="text-xs text-[var(--text-muted)] mt-1">{msg.timestamp}</div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: lineMessages.length * 0.3 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[var(--brand)]/20 rounded-2xl p-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[var(--brand)] rounded-full"
                            variants={typingDots}
                            animate="animate"
                            transition={{ delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Development Roadmap */}
        <section id="roadmap" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Roadmap</h2>
              <p className="text-lg text-[var(--text-muted)]">
                What's shipping when
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {Object.entries(roadmap).map(([timeframe, items]) => (
                <motion.div key={timeframe} variants={fadeInUp} className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {timeframe === 'now' && <Zap className="w-5 h-5 text-[var(--accent)]" />}
                    {timeframe === 'next' && <Star className="w-5 h-5 text-[var(--brand)]" />}
                    {timeframe === 'later' && <Globe className="w-5 h-5 text-blue-400" />}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      timeframe === 'now' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                      timeframe === 'next' ? 'bg-[var(--brand)]/20 text-[var(--brand)]' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </span>
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          timeframe === 'now' ? 'bg-[var(--accent)]' :
                          timeframe === 'next' ? 'bg-[var(--brand)]' :
                          'bg-blue-400'
                        }`} />
                        <span className="text-[var(--text-muted)] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Live Progress & Status */}
        <section id="progress" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Progress & Status</h2>
              <p className="text-lg text-[var(--text-muted)]">
                Real development progress, updated regularly
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {progress.map((item) => (
                <motion.div
                  key={item.key}
                  variants={fadeInUp}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="text-sm font-mono text-[var(--brand)]">{item.percent}%</span>
                  </div>
                  <div className="progress-bar-container w-full h-2 mb-3">
                    <motion.div
                      className="progress-bar-fill h-2"
                      variants={progressBar}
                      initial="hidden"
                      whileInView="visible"
                      custom={item.percent}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{item.note}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8 text-sm text-[var(--text-muted)]"
            >
              Last updated: {getLastUpdated()}
            </motion.div>
          </div>
        </section>

        {/* Changelog */}
        <section id="changelog" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Changelog</h2>
              <p className="text-lg text-[var(--text-muted)]">
                Recent updates and improvements
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {changelog.map((entry) => (
                <motion.div
                  key={entry.date}
                  variants={fadeInUp}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.type === 'major' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <span className="font-mono text-sm text-[var(--text-muted)]">{entry.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.type === 'major' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {entry.type === 'major' ? 'Major' : 'Minor'}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {entry.items.map((item, index) => (
                      <li key={index} className="text-[var(--text-muted)] text-sm">• {item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-[var(--text-muted)]">
                Everything you need to know about Claqueta
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="card p-6"
                >
                  <h3 className="font-semibold mb-3 text-[var(--brand)]">{faq.question}</h3>
                  <div 
                    className="text-[var(--text-muted)] text-sm"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative p-12 card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/20 via-transparent to-[var(--accent)]/20" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  If you make films, this is for you.
                </h2>
                <p className="text-lg text-[var(--text-muted)] mb-8">
                  Join the beta and help shape the future of film production tools.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/hub" className="btn btn-primary btn-lg">
                    Try the Beta
                  </Link>
                  <button onClick={() => setShowWaitlistModal(true)} className="btn btn-secondary btn-lg">
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-[var(--border)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              © 2025 Claqueta. Built for filmmakers, by filmmakers.
            </p>
            <div className="flex items-center gap-6 text-[var(--text-muted)]">
              <a href="https://instagram.com/claqueta" className="hover:text-[var(--brand)] transition-colors flex items-center gap-1">
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a href="https://facebook.com/claqueta" className="hover:text-[var(--brand)] transition-colors flex items-center gap-1">
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
              <a href="mailto:hello@claqueta.app" className="hover:text-[var(--brand)] transition-colors flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Join Waitlist Modal */}
      <JoinWaitlistModal 
        isOpen={showWaitlistModal} 
        onClose={() => setShowWaitlistModal(false)} 
      />
    </div>
  );
}