'use client';

import { useState, useEffect } from 'react';

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const [projectName, setProjectName] = useState('');
  const [phase, setPhase] = useState<'pre' | 'prod' | 'wrap'>('pre');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('filmProductionProjects');
      if (stored) {
        const projects = JSON.parse(stored);
        const project = projects.find((p: any) => p.id === projectId);
        if (project) {
          setProjectName(project.name || 'Untitled Project');
          setPhase(project.phase || 'pre');
        }
      }
    } catch {
      setProjectName('Untitled Project');
    }
  }, [projectId]);

  const getPhaseLabel = () => {
    switch (phase) {
      case 'pre':
        return 'Pre-production';
      case 'prod':
        return 'Production';
      case 'wrap':
        return 'Wrap';
      default:
        return 'Pre-production';
    }
  };

  const getPhaseStyles = () => {
    switch (phase) {
      case 'pre':
        return 'bg-[var(--accent-600)]/15 text-[var(--accent-400)]';
      case 'prod':
        return 'bg-[var(--accent-600)]/15 text-[var(--accent-400)]';
      case 'wrap':
        return 'bg-[var(--accent-600)]/15 text-[var(--accent-400)]';
      default:
        return 'bg-[var(--accent-600)]/15 text-[var(--accent-400)]';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-lg font-semibold text-[var(--text)] transition-all duration-300">
        {projectName}
      </h1>
      <span className={`
        px-3 py-1 text-xs font-medium rounded-full transition-all duration-300
        ${getPhaseStyles()}
      `}>
        {getPhaseLabel()}
      </span>
    </div>
  );
}