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
        return 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/20 shadow-blue-500/10';
      case 'prod':
        return 'bg-gradient-to-r from-[var(--brand)]/20 to-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 shadow-[var(--brand)]/10';
      case 'wrap':
        return 'bg-gradient-to-r from-orange-600/20 to-orange-500/10 text-orange-400 border border-orange-500/20 shadow-orange-500/10';
      default:
        return 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-lg font-semibold text-[var(--text)] transition-all duration-300">
        {projectName}
      </h1>
      <span className={`
        px-3 py-1 text-xs font-medium rounded-full 
        shadow-sm transition-all duration-300 hover:shadow-md
        ${getPhaseStyles()}
      `}>
        {getPhaseLabel()}
      </span>
    </div>
  );
}