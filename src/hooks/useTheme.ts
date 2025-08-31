'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'cozy' | 'compact';

interface UISettings {
  theme: Theme;
  density: Density;
  reduceMotion: boolean;
  language: 'en' | 'th';
}

const defaultSettings: UISettings = {
  theme: 'dark',
  density: 'cozy',
  reduceMotion: false,
  language: 'en'
};

function getStoredSettings(): UISettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    return {
      theme: (localStorage.getItem('ui.theme') as Theme) || defaultSettings.theme,
      density: (localStorage.getItem('ui.density') as Density) || defaultSettings.density,
      reduceMotion: localStorage.getItem('ui.reduceMotion') === 'true',
      language: (localStorage.getItem('ui.language') as 'en' | 'th') || defaultSettings.language
    };
  } catch {
    return defaultSettings;
  }
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  let actualTheme = theme;
  if (theme === 'system') {
    actualTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', actualTheme);
}

function applyReduceMotion(reduce: boolean) {
  if (typeof window === 'undefined') return;
  
  if (reduce) {
    document.documentElement.setAttribute('data-reduce-motion', 'true');
  } else {
    document.documentElement.removeAttribute('data-reduce-motion');
  }
}

export function useTheme() {
  const [settings, setSettings] = useState<UISettings>(getStoredSettings);

  const updateSetting = <K extends keyof UISettings>(key: K, value: UISettings[K]) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`ui.${key}`, String(value));
      setSettings(prev => ({ ...prev, [key]: value }));
      
      if (key === 'theme') {
        applyTheme(value as Theme);
      } else if (key === 'reduceMotion') {
        applyReduceMotion(value as boolean);
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  // Listen for system theme changes when using 'system' theme
  useEffect(() => {
    if (settings.theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => applyTheme('system');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  return {
    settings,
    updateSetting
  };
}