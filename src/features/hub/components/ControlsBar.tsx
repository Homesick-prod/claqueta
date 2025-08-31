'use client';

import React, { useEffect, useRef } from 'react';
import { Search, Upload } from 'lucide-react';

interface ControlsBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: 'all' | 'active' | 'archived' | 'favorites';
  onFilterChange: (filter: 'all' | 'active' | 'archived' | 'favorites') => void;
  sortBy: 'recent' | 'name';
  onSortChange: (sort: 'recent' | 'name') => void;
  onImport: () => void;
}

export default function ControlsBar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  onImport,
}: ControlsBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-3 mb-4">
      <div className="relative flex-1 w-full md:w-auto md:min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects… (⌘K)"
          className="input pl-10 w-full"
        />
      </div>
      
      <div className="segment">
        <button
          onClick={() => onFilterChange('all')}
          className={`segment-item ${filter === 'all' ? 'segment-item-active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`segment-item ${filter === 'active' ? 'segment-item-active' : ''}`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange('archived')}
          className={`segment-item ${filter === 'archived' ? 'segment-item-active' : ''}`}
        >
          Archived
        </button>
        <button
          onClick={() => onFilterChange('favorites')}
          className={`segment-item ${filter === 'favorites' ? 'segment-item-active' : ''}`}
        >
          Favorites
        </button>
      </div>
      
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'recent' | 'name')}
        className="input w-full md:w-auto"
      >
        <option value="recent">Recent</option>
        <option value="name">Name (A→Z)</option>
      </select>
      
      <button onClick={onImport} className="btn btn-secondary w-full md:w-auto">
        <Upload className="w-4 h-4 mr-2" />
        Import
      </button>
    </div>
  );
}