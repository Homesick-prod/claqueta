'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sun, Moon, Monitor, Maximize2, Minimize2, Zap, Globe } from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [density, setDensity] = useState<'cozy' | 'compact'>('cozy');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState<'en' | 'th'>('en');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ui.theme') as typeof theme || 'dark';
    const savedDensity = localStorage.getItem('ui.density') as typeof density || 'cozy';
    const savedReduceMotion = localStorage.getItem('ui.reduceMotion') === 'true';
    const savedLanguage = localStorage.getItem('ui.language') as typeof language || 'en';
    
    setTheme(savedTheme);
    setDensity(savedDensity);
    setReduceMotion(savedReduceMotion);
    setLanguage(savedLanguage);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const applyTheme = (newTheme: typeof theme) => {
    setTheme(newTheme);
    localStorage.setItem('ui.theme', newTheme);
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const applyDensity = (newDensity: typeof density) => {
    setDensity(newDensity);
    localStorage.setItem('ui.density', newDensity);
    document.documentElement.setAttribute('data-density', newDensity);
  };

  const applyReduceMotion = (value: boolean) => {
    setReduceMotion(value);
    localStorage.setItem('ui.reduceMotion', String(value));
    
    if (value) {
      document.documentElement.setAttribute('data-reduce-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduce-motion');
    }
  };

  const applyLanguage = (newLang: typeof language) => {
    setLanguage(newLang);
    localStorage.setItem('ui.language', newLang);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bottom-24 right-6 w-80 max-h-[70vh] overflow-y-auto card p-0 z-50"
      style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold">Settings</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[var(--neutral-700)] hover:bg-opacity-20 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-5 space-y-6">
        {/* Theme Section */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Theme</h3>
          <div className="segment w-full">
            <button
              onClick={() => applyTheme('light')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                theme === 'light' ? 'segment-item-active' : ''
              }`}
              aria-pressed={theme === 'light'}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => applyTheme('dark')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                theme === 'dark' ? 'segment-item-active' : ''
              }`}
              aria-pressed={theme === 'dark'}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => applyTheme('system')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                theme === 'system' ? 'segment-item-active' : ''
              }`}
              aria-pressed={theme === 'system'}
            >
              <Monitor className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </div>
        
        {/* Density Section */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Density</h3>
          <div className="segment w-full">
            <button
              onClick={() => applyDensity('cozy')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                density === 'cozy' ? 'segment-item-active' : ''
              }`}
              aria-pressed={density === 'cozy'}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Cozy</span>
            </button>
            <button
              onClick={() => applyDensity('compact')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                density === 'compact' ? 'segment-item-active' : ''
              }`}
              aria-pressed={density === 'compact'}
            >
              <Minimize2 className="w-4 h-4" />
              <span>Compact</span>
            </button>
          </div>
        </div>
        
        {/* Motion Section */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Motion</h3>
          <button
            onClick={() => applyReduceMotion(!reduceMotion)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[var(--neutral-700)] hover:bg-opacity-10 transition-colors"
            aria-pressed={reduceMotion}
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Reduce motion</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${
              reduceMotion ? 'bg-[var(--brand)]' : 'bg-[var(--neutral-700)] bg-opacity-30'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                reduceMotion ? 'translate-x-5' : 'translate-x-0.5'
              }`} style={{ marginTop: '2px' }} />
            </div>
          </button>
        </div>
        
        {/* Language Section */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Language</h3>
          <div className="segment w-full">
            <button
              onClick={() => applyLanguage('en')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                language === 'en' ? 'segment-item-active' : ''
              }`}
              aria-pressed={language === 'en'}
            >
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
            <button
              onClick={() => applyLanguage('th')}
              className={`segment-item flex-1 flex items-center justify-center gap-2 ${
                language === 'th' ? 'segment-item-active' : ''
              }`}
              aria-pressed={language === 'th'}
            >
              <Globe className="w-4 h-4" />
              <span>ไทย</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}