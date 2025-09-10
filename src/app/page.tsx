'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Check,
  X,Mail,Star,Zap,
  Globe,
  Smartphone,
  Instagram,
  Facebook,
  CheckCircle2,
  ArrowRight,
  Camera,
  Calendar,
  Users,
  FileText,
  MapPin,
  Clock,
  Film,
  Palette,
  Image,
  Building2,
  Video,
  Clapperboard,
  Megaphone,
  Layout,
  Wallet,
  StickyNote,
  Package,
  BarChart3,
  DollarSign,
  Target,
  Layers,
  Settings,
  Sparkles,Info, CheckCheck, MessageCircle
} from 'lucide-react';
import {
  useMounted,
  buildStars,
  lockScrollUntilIntroEnds,
  unlockScrollAfterIntro,
  observe,
  usePointerAura,
  whipBlur,
  startRealtimeHeroLoop
} from '@/lib/anim';
import gsap from 'gsap';
import { HERO, FEATURE_BLOCKS, PROGRESS, ROADMAP, CHANGELOG, FAQ, PRICING, LINE_DEMO } from './data';

// Types
interface Star {
  id: number;
  x: number;
  y: number;
  size: 'sm' | 'md' | 'lg';
  twinkleDur: number;
  driftDur: number;
  dx: number;
  dy: number;
}


// 🔒 LOCKED display-name → icon component (no regex/slug)
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const FEATURE_NAME_TO_ICON: Record<string, IconType> = {
  // Pre-production
  "Script & Imports": FileText,
  "AI Script Breakdown": Sparkles,
  "Moodboard / Storyboard": Palette,
  "Locations & Floor plan": Building2,
  "Shotlist": Video,
  "Stripboard / Shooting schedule": Layout,
  "Calendar": Calendar,
  "Contacts & Roles": Users,
  "Tasks / Kanban": CheckCircle2,
  "Budget / Equipment": DollarSign,
  "Notes / Risks": StickyNote,

  // Production
  "Call sheets": Megaphone,
  "Daily schedule / Unit move": Clock,
  "Shot progress / Continuity": Layers,
  "Dailies links": Video,

  // Wrap
  "Deliverables checklist": Package,
  "Reports & Post handoff": BarChart3,
};

// ตัวช่วยสั้นๆ (fallback เป็น FileText)
function resolveIconByName(name: string): IconType {
  return FEATURE_NAME_TO_ICON[name] ?? FileText;
}


// Starfield component with hydration safety
const Starfield = () => {
  const mounted = useMounted();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (mounted) {
      const seed = Date.now() % 1000000000; // Vary per reload but client-only
      setStars(buildStars(25, seed));
    }
  }, [mounted]);

  if (!mounted || stars.length === 0) {
    return <div className="starfield" />;
  }

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.size} ${star.driftDur > 0 ? 'drift' : ''}`}
          style={{
            '--x': `${star.x}%`,
            '--y': `${star.y}%`,
            '--twinkle-dur': `${star.twinkleDur}s`,
            '--drift-dur': `${star.driftDur}s`,
            '--drift-dx': `${star.dx}px`,
            '--drift-dy': `${star.dy}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDuration: `${star.twinkleDur}s${star.driftDur > 0 ? `, ${star.driftDur}s` : ''}`,
            animationName: star.driftDur > 0 ? 'twinkle, drift' : 'twinkle'
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};


// Join Waitlist Modal
const JoinWaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
      setRole('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="card p-6">
          {!submitted ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Join the Waitlist</h3>
                <button onClick={onClose} className="btn-ghost p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[var(--text-muted)] mb-6">
                {HERO.ctaSecondary.note}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="director">Director</option>
                    <option value="producer">Producer</option>
                    <option value="ad">Assistant Director</option>
                    <option value="dop">Director of Photography</option>
                    <option value="other">Other..</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Join Waitlist
                  </button>
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-[var(--brand)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
              <p className="text-[var(--text-muted)]">We'll keep you updated on our progress.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function LandingPage() {
  // STATE
  const [stars, setStars] = useState<Star[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [appbarVisible, setAppbarVisible] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  // REFS
  const heroRef = useRef<HTMLElement>(null);
  const nextHeaderRef = useRef<HTMLElement>(null);
  const appbarRef = useRef<HTMLElement>(null);

  const mounted = useMounted();

  // Build stars after mount (hydration-safe)
  useEffect(() => {
    if (mounted) {
      const seed = Date.now() % 1000000000;
      setStars(buildStars(15, seed));
    }
  }, [mounted]);

  // Intro timeline (plays on every reload)
  useEffect(() => {
    if (!mounted) return;

    // Lock immediately when page mounts (before intro anim starts)
    lockScrollUntilIntroEnds();

    // T0: base bg only, bars retracted, scroll locked
    document.documentElement.style.setProperty('--heroEpicOpacity', '0');
    document.documentElement.style.setProperty('--lb-open', '1');

    // T1 (~900ms): hero epic fades in
    setTimeout(() => {
      document.documentElement.style.setProperty('--heroEpicOpacity', '1');
    }, 900);

    // T2 (+400ms): bars slide in
    setTimeout(() => {
      document.documentElement.style.setProperty('--lb-open', '0');
    }, 1300);

    // T3: Hero headline lines appear (handled by CSS animations)
    // Then unlock scroll
    setTimeout(() => {
      setUnlocked(true);
    }, 4000);
  }, [mounted]);

  // Start realtime loop and unlock after intro
  useEffect(() => {
    if (!unlocked) return;
    const el = heroRef.current;
    if (!el) return;

    // kill intro easing for live response
    const root = document.documentElement;
    root.style.setProperty('--lb-tr', '0s');
    root.style.setProperty('--hero-tr', '0s');

    // Release the scroll lock now
    unlockScrollAfterIntro();

    const stop = startRealtimeHeroLoop(el, (p) => {
      // realtime progress each frame
      const lb = p;
      const epic = 1 - p;
      root.style.setProperty('--lb-open', lb.toFixed(4));
      root.style.setProperty('--heroEpicOpacity', epic.toFixed(4));
    }, { smooth: false });                         // no smoothing for true realtime

    return () => stop && stop();
  }, [unlocked]);

  // Appbar visibility with IntersectionObserver
  useEffect(() => {
    if (!nextHeaderRef.current) return;

    const unobserve = observe(nextHeaderRef.current, (entries) => {
      const isVisible = entries[0].isIntersecting;
      setAppbarVisible(!isVisible);
    }, { rootMargin: "-64px 0px 0px 0px" });

    return unobserve;
  }, []);

  // Appbar enter/exit classes
  useEffect(() => {
    if (!appbarRef.current) return;

    requestAnimationFrame(() => {
      if (appbarRef.current) {
        if (appbarVisible) {
          appbarRef.current.classList.add('appbar-enter');
          appbarRef.current.classList.remove('appbar-exit');
        } else {
          appbarRef.current.classList.add('appbar-exit');
          appbarRef.current.classList.remove('appbar-enter');
        }
      }
    });
  }, [appbarVisible]);

  // Pointer aura + tap ripple + whip-tilt motion blur
  usePointerAura();

  // Navigation click handler with whip blur
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    whipBlur('down');

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--page-bg)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text)] overflow-x-hidden relative">
      {/* Background layers */}
      <div className="bg-layers">
        <div className="bg-base-layer" />
        <div className="bg-hero-layer" />
      </div>

      {/* Starfield */}
      <Starfield />

      {/* Letterbox Overlay */}
      <div className="lb-fixed">
        <div className="lb-bar lb-top" />
        <div className="lb-bar lb-bottom" />
      </div>

      {/* Appbar */}
      {appbarVisible && (
        <nav ref={appbarRef} className="fixed top-0 left-0 right-0 z-50 appbar-glass h-16">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="text-xl font-bold text-[var(--brand)]">Claqueta</div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-[var(--brand)] transition-colors">Features</a>
              <a href="#workflow" onClick={(e) => handleNavClick(e, 'workflow')} className="hover:text-[var(--brand)] transition-colors">Workflow</a>
              <a href="#line" onClick={(e) => handleNavClick(e, 'line')} className="hover:text-[var(--brand)] transition-colors">LINE</a>
              <a href="#roadmap" onClick={(e) => handleNavClick(e, 'roadmap')} className="hover:text-[var(--brand)] transition-colors">Roadmap</a>
              <a href="#progress" onClick={(e) => handleNavClick(e, 'progress')} className="hover:text-[var(--brand)] transition-colors">Progress</a>
              <a href="#changelog" onClick={(e) => handleNavClick(e, 'changelog')} className="hover:text-[var(--brand)] transition-colors">Changelog</a>
              <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-[var(--brand)] transition-colors">FAQ</a>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link href="/hub" className="btn btn-primary btn-sm">Try the Beta</Link>
              <button onClick={() => setShowWaitlistModal(true)} className="btn btn-secondary btn-sm">Join Waitlist</button>
            </div>
          </div>
        </nav>
      )}

      {/* === DO NOT MODIFY THIS HERO BLOCK (mobile sizes already tuned) === */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center justify-center px-4 z-30"
      >
        <div className="max-w-4xl mx-auto text-center">
          {(() => {
            const STAGGER_START = 1.5;
            const STAGGER_STEP = 0.2;
            const afterTitle = STAGGER_START + HERO.headlineLines.length * STAGGER_STEP;

            return (
              <>
                <h1 className="hero-title font-bold mb-6 text-center leading-tight">
                  {HERO.headlineLines.map((line, index) => (
                    <span
                      key={index}
                      className={[
                        "hero-line", "block", "animate", "bob", "float-soft",
                        index === 0
                          ? "text-[var(--brand)] text-6xl md:text-6xl lg:text-7xl xl:text-8xl text-glow-brand"
                          : "text-4xl md:text-4xl lg:text-5xl xl:text-6xl"
                      ].join(" ")}
                      style={{ animationDelay: `${STAGGER_START + index * STAGGER_STEP}s` }}
                    >
                      {line}
                    </span>
                  ))}
                </h1>

                <p
                  className="hero-line block animate bob float-soft
                             text-base sm:text-lg md:text-xl
                             text-[var(--text-muted)] mb-8 max-w-2xl mx-auto text-center"
                  style={{ animationDelay: `${afterTitle + 0.25}s` }}
                >
                  {HERO.tagline}
                </p>

                <div
                  className="hero-line block animate bob float-soft flex flex-col sm:flex-row items-center justify-center gap-3"
                  style={{ animationDelay: `${afterTitle + 0.55}s` }}
                >
                  <Link href={HERO.ctaPrimary.href} className="btn btn-primary btn-hero-sm inline-flex items-center gap-2">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                    </svg>
                    {HERO.ctaPrimary.label}
                  </Link>
                  <button onClick={() => setShowWaitlistModal(true)} className="btn btn-secondary btn-hero-sm">
                    {HERO.ctaSecondary.label}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </section>
      {/* === END: DO NOT MODIFY === */}

      {/* Content sections */}
      <div className="relative z-30 pt-[150px]">
        {/* Features Grid */}
        <section id="features" ref={nextHeaderRef} className="py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Real Production</h2>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Every feature serves actual filmmaking workflows. No fluff, no fake promises.
              </p>
            </div>

            {FEATURE_BLOCKS.map((block, blockIndex) => (
              <div key={blockIndex} className="mb-16">
                <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
                <p className="text-[var(--text-muted)] mb-8">{block.blurb}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {block.items.map((item, itemIndex) => {
                    const FeatureIcon = resolveIconByName(item.name);
                    return (
                      <div key={itemIndex} className="card p-6">
                        <div className="flex items-start items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center flex-shrink-0">
                            <FeatureIcon className="w-6 h-6 text-[var(--brand)]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Production Workflow</h2>
              <p className="text-lg text-[var(--text-muted)]">Action → Output at every step</p>
            </div>

            <div className="text-center">
              <p className="text-[var(--text-muted)]">Detailed workflow section coming soon...</p>
            </div>
          </div>
        </section>

        {/* LINE Integration */}
        <section id="line" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">LINE Integration</h2>
              <p className="text-lg text-[var(--text-muted)]">Two-way communication with your crew</p>
            </div>

            <div className="card rounded-[2rem] p-6 border-2 border-[var(--border)] relative mx-auto max-w-sm">
              {/* Phone Screen Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                <div className="w-10 h-10 bg-[var(--brand)] rounded-full flex items-center justify-center text-white font-bold">C</div>
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
                {LINE_DEMO.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.from === 'claqueta' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-3 ${msg.from === 'claqueta'
                        ? 'bg-[var(--brand)]/20 text-[var(--text)]'
                        : 'bg-[var(--accent)]/20 text-[var(--text)]'
                      }`}>
                      <div className="text-sm">{msg.text}</div>
                      {msg.meta && (
                        <div className="text-xs text-[var(--text-muted)] mt-1">{msg.meta}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Development Roadmap */}
        <section id="roadmap" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Roadmap</h2>
              <p className="text-lg text-[var(--text-muted)]">What's shipping when</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(ROADMAP).map(([timeframe, items]) => (
                <div key={timeframe} className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {timeframe === 'now' && <Zap className="w-5 h-5 text-[var(--accent)]" />}
                    {timeframe === 'next' && <Star className="w-5 h-5 text-[var(--brand)]" />}
                    {timeframe === 'later' && <Globe className="w-5 h-5 text-blue-400" />}
                    <span className={`px-2 py-1 text-xs rounded-full ${timeframe === 'now' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                        timeframe === 'next' ? 'bg-[var(--brand)]/20 text-[var(--brand)]' :
                          'bg-blue-500/20 text-blue-400'
                      }`}>
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </span>
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${timeframe === 'now' ? 'bg-[var(--accent)]' :
                            timeframe === 'next' ? 'bg-[var(--brand)]' :
                              'bg-blue-400'
                          }`} />
                        <span className="text-[var(--text-muted)] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Progress & Status */}
        <section id="progress" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Progress & Status</h2>
              <p className="text-lg text-[var(--text-muted)]">
                Real development progress, updated regularly
              </p>
            </div>

            <div className="space-y-6">
              {PROGRESS.map((item) => (
                <div key={item.name} className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className={`status-pill-fixed text-center text-xs px-2 py-1 rounded-full ${item.status === 'shipped' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'in_progress' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                          'bg-blue-500/20 text-blue-400'
                      }`}>
                      {item.status === 'shipped' ? 'Shipped' :
                        item.status === 'in_progress' ? 'In Progress' : 'Planned'}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[var(--neutral-700)] rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] rounded-full transition-all duration-1000"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{item.percent}% complete</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 text-sm text-[var(--text-muted)]">
              Last updated: {new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" })} (UTC+7)
            </div>
          </div>
        </section>

        {/* Changelog */}
        <section id="changelog" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Changelog</h2>
              <p className="text-lg text-[var(--text-muted)]">Recent updates and improvements</p>
            </div>

            <div className="space-y-6">
              {CHANGELOG.map((entry) => (
                <div key={entry.date} className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${entry.type === 'major' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                    <span className="font-mono text-sm text-[var(--text-muted)]">{entry.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${entry.type === 'major'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                      }`}>
                      {entry.type === 'major' ? 'Major' : 'Minor'}
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-[var(--text-muted)]">Everything you need to know about Claqueta</p>
            </div>

            <div className="space-y-6">
              {FAQ.map((faq, index) => (
                <div key={index} className="card p-6">
                  <h3 className="font-semibold mb-3 text-[var(--brand)]">{faq.q}</h3>
                  <p className="text-[var(--text-muted)] text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4 bg-[var(--surface)]/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
              <p className="text-lg text-[var(--text-muted)]">Simple, transparent pricing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRICING.map((plan, index) => (
                <div key={index} className="card p-6 text-center">
                  <h3 className="font-semibold mb-2">{plan.tier}</h3>
                  <div className="text-2xl font-bold text-[var(--brand)] mb-2">{plan.price}</div>
                  <p className="text-xs text-[var(--text-muted)]">{plan.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
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
          </div>
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