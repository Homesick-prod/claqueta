'use client';

import React, { useState, useEffect } from 'react';
import AppBar from '@/features/hub/components/AppBar';
import ControlsBar from '@/features/hub/components/ControlsBar';
import UsageBar from '@/features/hub/components/UsageBar';
import ProjectGrid from '@/features/hub/components/ProjectGrid';
import NewProjectModal from '@/features/hub/components/NewProjectModal';
import ImportProject from '@/features/hub/components/ImportProject';
import ManageSlotsModal from '@/features/hub/components/ManageSlotsModal';
import SettingsFAB from '@/features/hub/components/SettingsFAB';
import { Project } from '@/types/domain';
import {
  getProjects,
  searchProjects,
  filterProjects,
  sortProjects,
} from '@/lib/projects-local';

export default function HubPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'archived' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    const loaded = getProjects();
    setProjects(loaded);
    setFilteredProjects(loaded);
  }, []);

  useEffect(() => {
    let result = [...projects];
    
    if (searchQuery) {
      result = searchProjects(result, searchQuery);
    }
    
    result = filterProjects(result, filter);
    result = sortProjects(result, sortBy);
    
    setFilteredProjects(result);
  }, [projects, searchQuery, filter, sortBy]);

  const handleProjectsUpdate = (updated: Project[]) => {
    setProjects(updated);
  };

  const activeCount = projects.filter(p => p.active && !p.archived).length;
  const hasProjects = projects.length > 0;

  return (
    <div className="relative min-h-screen bg-[var(--page-bg)] page-decor">
      <AppBar />
      
      <div className="relative pt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {hasProjects ? (
            <>
              <ControlsBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onImport={() => setShowImportModal(true)}
              />
              
              <UsageBar
                activeCount={activeCount}
                onManage={() => setShowManageModal(true)}
              />
              
              <ProjectGrid
                projects={filteredProjects}
                onProjectsUpdate={handleProjectsUpdate}
                onNewProject={() => setShowNewModal(true)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 rounded-full bg-[var(--brand)] bg-opacity-10 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold mb-3">Welcome to Claqueta</h2>
              <p className="text-[var(--text-muted)] max-w-md mb-8">
                Start managing your film production projects. Create a new project from a template or import an existing one.
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => setShowNewModal(true)} className="btn btn-primary">
                  Create from template
                </button>
                <button onClick={() => setShowImportModal(true)} className="btn btn-secondary">
                  Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SettingsFAB />
      
      <NewProjectModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onProjectsUpdate={handleProjectsUpdate}
      />
      
      <ImportProject
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onProjectsUpdate={handleProjectsUpdate}
      />
      
      <ManageSlotsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        projects={projects}
        onProjectsUpdate={handleProjectsUpdate}
      />
    </div>
  );
}