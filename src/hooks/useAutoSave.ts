'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Auto-save hook with debouncing and deep comparison
 * @param value - The value to save
 * @param onSave - Function to call when saving
 * @param deps - Dependencies to watch for changes
 * @param delay - Debounce delay in milliseconds (default: 500)
 */
export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => void,
  deps: any[] = [],
  delay: number = 500
) {
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>();
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip the first render to avoid saving initial state
    if (isInitialRender.current) {
      isInitialRender.current = false;
      lastSavedRef.current = JSON.stringify(value);
      return;
    }

    // Don't save if value is null/undefined
    if (value === null || value === undefined) {
      return;
    }

    const currentSerialized = JSON.stringify(value);
    
    // Skip if no changes detected
    if (currentSerialized === lastSavedRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set saving state
    setIsSaving(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        onSave(value);
        lastSavedRef.current = currentSerialized;
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsSaving(false);
      }
    };
  }, [value, onSave, delay, ...deps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isSaving };
}

/**
 * Safe localStorage utility functions
 */
export function safeLocal<T>(key: string, fallback: T): {
  get: () => T;
  set: (value: T) => void;
} {
  const get = (): T => {
    try {
      if (typeof window === 'undefined') return fallback;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  };

  const set = (value: T): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return { get, set };
}