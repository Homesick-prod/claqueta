'use client';

import { Menu } from 'lucide-react';
import { useEffect } from 'react';

interface HamburgerButtonProps {
  onToggle: () => void;
  isOpen?: boolean;
}

export default function HamburgerButton({ onToggle, isOpen = false }: HamburgerButtonProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        onToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-[var(--neutral-800)]/30 transition-colors"
      aria-label="Toggle sidebar"
      aria-pressed={isOpen}
      aria-controls="project-sidebar"
      aria-expanded={isOpen}
    >
      <Menu className="w-5 h-5 text-[var(--text)]" />
    </button>
  );
}