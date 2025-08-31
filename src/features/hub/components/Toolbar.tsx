'use client';

import React, { useEffect } from 'react';
import { Search, Plus, Upload, Grid3x3, Settings } from 'lucide-react';
import type { ProjectFilter, ProjectSort } from '@/types/domain';

interface ToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  sort: ProjectSort;
  onSortChange: (sort: ProjectSort) => void;
  onNewClick: () => void;
  onImportClick: () => void;
  onTemplatesClick: () => void;
  onSettingsClick: () => void;
}

export default function Toolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onNewClick,
  onImportClick,
  onTemplatesClick,
  onSettingsClick
}: ToolbarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('#search-input');
        searchInput?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="topbar">
      <div className="container">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[var(--brand)]">Claqueta</h1>
          </div>

          {/* Center: Search + Filters + Sort */}
          <div className="flex flex-1 items-center justify-center gap-4 max-w-4xl">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-500)]" />
              <input
                id="search-input"
                type="text"
                placeholder="Search projects… (⌘K)"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="input pl-10 w-64 max-w-full"
              />
            </div>

            {/* Filter tabs */}
            <div className="segment">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'archived', label: 'Archived' },
                { key: 'favorite', label: 'Favorites' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onFilterChange(key as ProjectFilter)}
                  className={`segment-btn ${filter === key ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ProjectSort)}
              className="input w-auto"
            >
              <option value="recent">Recent</option>
              <option value="name">A → Z</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button onClick={onTemplatesClick} className="btn-ghost">
              <Grid3x3 className="w-4 h-4" />
              Templates
            </button>
            <button onClick={onImportClick} className="btn-ghost">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button onClick={onNewClick} className="btn-primary">
              <Plus className="w-4 h-4" />
              New Project
            </button>
            <button
              onClick={onSettingsClick}
              className="btn-ghost p-2"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}