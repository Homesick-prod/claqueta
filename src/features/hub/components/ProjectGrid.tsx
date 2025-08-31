'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project } from '@/types/domain';

interface ProjectGridProps {
  projects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
  onNewProject: () => void;
}

export default function ProjectGrid({ projects, onProjectsUpdate, onNewProject }: ProjectGridProps) {
  return (
    <div 
      className="grid"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--grid-gap)',
      }}
    >
      <button
        onClick={onNewProject}
        className="card card-hover min-h-[200px] flex flex-col items-center justify-center gap-3 border-dashed"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
          <Plus className="w-6 h-6 text-[var(--brand)]" />
        </div>
        <span className="text-[var(--text-muted)]">Create new project</span>
      </button>
      
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onProjectsUpdate={onProjectsUpdate}
        />
      ))}
    </div>
  );
}