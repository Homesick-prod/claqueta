'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Edit2 } from 'lucide-react';
import { CallSheetDoc } from '../model';

interface CallsheetsHeaderCenterProps {
  projectName: string;
  doc: CallSheetDoc;
  onCreatePage: () => void;
  onSwitch: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export default function CallsheetsHeaderCenter({
  projectName,
  doc,
  onCreatePage,
  onSwitch,
  onRename,
}: CallsheetsHeaderCenterProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const activePage = doc.pages.find(p => p.id === doc.activePageId);
  const hasMultiplePages = doc.pages.length > 1;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingPageId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingPageId]);

  const handlePageDoubleClick = () => {
    if (!activePage) return;
    
    setEditingPageId(activePage.id);
    setEditTitle(activePage.title);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingPageId && editTitle.trim()) {
        onRename(editingPageId, editTitle.trim());
      }
      setEditingPageId(null);
    } else if (e.key === 'Escape') {
      setEditingPageId(null);
    }
  };

  const handleEditBlur = () => {
    if (editingPageId && editTitle.trim()) {
      onRename(editingPageId, editTitle.trim());
    }
    setEditingPageId(null);
  };

  const handlePageSelect = (pageId: string) => {
    onSwitch(pageId);
    setShowDropdown(false);
  };

  if (!activePage) return null;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Project Name */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] min-w-0">
        <span className="truncate" title={projectName}>
          {projectName}
        </span>
        <span>/</span>
      </div>

      {/* Page Selector */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden sm:inline text-sm text-[var(--text-muted)]">Call Sheet –</span>
        
        {editingPageId === activePage.id ? (
          <input
            ref={editInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleEditBlur}
            className="bg-transparent border-b border-[var(--brand)] text-sm font-medium text-[var(--text)] outline-none min-w-0 w-24"
          />
        ) : hasMultiplePages ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              onDoubleClick={handlePageDoubleClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--neutral-700)]/20 transition-colors text-sm font-medium text-[var(--text)] min-w-0"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <span className="truncate" title={activePage.title}>
                {activePage.title}
              </span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {doc.pages.map((page) => (
                    <div key={page.id} className="flex items-center">
                      <button
                        onClick={() => handlePageSelect(page.id)}
                        className={`flex-1 px-3 py-2 text-left text-sm hover:bg-[var(--neutral-700)]/20 transition-colors ${
                          page.id === doc.activePageId
                            ? 'text-[var(--brand)] bg-[var(--brand)]/10'
                            : 'text-[var(--text)]'
                        }`}
                      >
                        <span className="truncate" title={page.title}>
                          {page.title}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPageId(page.id);
                          setEditTitle(page.title);
                          setShowDropdown(false);
                        }}
                        className="p-1 mx-1 hover:bg-[var(--neutral-700)]/20 rounded transition-colors"
                        title="Rename page"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onDoubleClick={handlePageDoubleClick}
            className="text-sm font-medium text-[var(--text)] px-2 py-1 rounded hover:bg-[var(--neutral-700)]/20 transition-colors min-w-0"
          >
            <span className="truncate" title={activePage.title}>
              {activePage.title}
            </span>
          </button>
        )}
      </div>

      {/* Create Page Button */}
      <button
        onClick={onCreatePage}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[var(--brand)]/10 text-[var(--brand)] transition-colors flex-shrink-0"
        title="Create new page"
        aria-label="Create new page"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">Page</span>
      </button>
    </div>
  );
}