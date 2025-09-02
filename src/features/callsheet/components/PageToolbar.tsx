'use client';

import { Copy, Trash2, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PageToolbarProps {
  onDuplicate: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function PageToolbar({ onDuplicate, onDelete, canDelete }: PageToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleDuplicate = () => {
    onDuplicate();
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (canDelete && confirm('Are you sure you want to delete this page?')) {
      onDelete();
      setShowMenu(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-700)]/20 rounded-lg transition-colors"
        aria-label="Page options"
      >
        <MoreHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Page Options</span>
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleDuplicate}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-700)]/20 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate Page
            </button>
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Page
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}