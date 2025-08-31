'use client';

import React, { useEffect, useRef } from 'react';
import { BookOpen, X } from 'lucide-react';

interface ContactsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactsPopover({ isOpen, onClose }: ContactsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-16 right-40 w-80 card p-4 z-50"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Contacts</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--neutral-700)] hover:bg-opacity-20"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-center py-8 text-[var(--text-muted)]">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No contacts yet</p>
      </div>
    </div>
  );
}