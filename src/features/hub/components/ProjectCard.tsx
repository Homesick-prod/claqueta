'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Copy, Edit2, Archive, Trash2, Download, Star } from 'lucide-react';
import { Project } from '@/types/domain';
import {
  duplicateProject,
  deleteProject,
  toggleArchive,
  toggleFavorite,
  exportProject,
  renameProject,
} from '@/lib/projects-local';
import { projectPath } from '@/lib/paths';

interface ProjectCardProps {
  project: Project;
  onProjectsUpdate: (projects: Project[]) => void;
}

export default function ProjectCard({ project, onProjectsUpdate }: ProjectCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleCardClick = () => {
    router.push(projectPath(project.id));
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(false);
  };

  const handleRename = () => {
    if (newName.trim() && newName !== project.name) {
      onProjectsUpdate(renameProject(project.id, newName.trim()));
    }
    setIsRenaming(false);
  };

  const getPhaseChip = () => {
    const phase = project.phase || 'pre';
    const chipClass = phase === 'pre' ? 'chip-pre' : phase === 'prod' ? 'chip-prod' : 'chip-wrap';
    const label = phase === 'pre' ? 'Pre-prod' : phase === 'prod' ? 'Prod' : 'Wrap';
    return <span className={chipClass}>{label}</span>;
  };

  const formatDate = () => {
    const date = new Date(project.updatedAt);
    return `Updated ${date.toISOString().slice(0, 10)} ${date.toISOString().slice(11, 16)}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="card min-h-[200px] cursor-pointer relative group"
      style={{ padding: 'var(--card-pad)' }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setNewName(project.name);
                  setIsRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="input"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-semibold flex items-center gap-1">
              {project.favorite && <Star className="w-4 h-4 text-[var(--accent)]" />}
              {project.name}
            </h3>
          )}
        </div>
        
        <div ref={menuRef} className="relative">
          <button
            onClick={handleMenuClick}
            className="p-1 rounded hover:bg-[var(--neutral-700)] hover:bg-opacity-20 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="menu top-full right-0 mt-1">
              <button
                onClick={(e) => handleAction(e, () => onProjectsUpdate(duplicateProject(project.id)))}
                className="menu-item"
              >
                <Copy className="w-4 h-4 mr-2 inline" /> Duplicate
              </button>
              <button
                onClick={(e) => handleAction(e, () => setIsRenaming(true))}
                className="menu-item"
              >
                <Edit2 className="w-4 h-4 mr-2 inline" /> Rename
              </button>
              <button
                onClick={(e) => handleAction(e, () => onProjectsUpdate(toggleArchive(project.id)))}
                className="menu-item"
              >
                <Archive className="w-4 h-4 mr-2 inline" /> {project.archived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={(e) => handleAction(e, () => {
                  if (confirm('Delete this project?')) {
                    onProjectsUpdate(deleteProject(project.id));
                  }
                })}
                className="menu-item text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2 inline" /> Delete
              </button>
              <button
                onClick={(e) => handleAction(e, () => exportProject(project))}
                className="menu-item"
              >
                <Download className="w-4 h-4 mr-2 inline" /> Export
              </button>
              <button
                onClick={(e) => handleAction(e, () => onProjectsUpdate(toggleFavorite(project.id)))}
                className="menu-item"
              >
                <Star className="w-4 h-4 mr-2 inline" /> {project.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-[var(--text-muted)] mb-3">{formatDate()}</div>
      
      <div className="flex items-center justify-between">
        <div>{getPhaseChip()}</div>
        <div className="flex gap-4 text-sm">
          <span className="text-tabular">
            Shots: {project.counters?.shots || 0}
          </span>
          <span className="text-tabular">
            Strips: {project.counters?.strips || 0}
          </span>
        </div>
      </div>
    </div>
  );
}