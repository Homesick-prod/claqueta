'use client';

import { Menu, X } from 'lucide-react';

interface HamburgerButtonProps {
  onToggle: () => void;
  isOpen?: boolean;
}

export default function HamburgerButton({ onToggle, isOpen = false }: HamburgerButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="relative p-2 rounded-lg hover:bg-[var(--neutral-700)]/20 transition-all duration-300"
      aria-label="Toggle sidebar"
      aria-pressed={isOpen}
    >
      <div className="relative w-5 h-5">
        <Menu 
          className={`absolute inset-0 w-5 h-5 text-[var(--text)] transition-all duration-300 ${
            isOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
          }`} 
        />
        <X 
          className={`absolute inset-0 w-5 h-5 text-[var(--text)] transition-all duration-300 ${
            isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
          }`} 
        />
      </div>
    </button>
  );
}