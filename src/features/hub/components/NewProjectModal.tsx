'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '../../../types/domain';
import { createProject } from '../../../lib/projects-local';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsUpdate: (projects: Project[]) => void;
}

export default function NewProjectModal({ isOpen, onClose, onProjectsUpdate }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<'pre' | 'prod' | 'wrap'>('pre');

  const handleCreate = () => {
    if (!name.trim()) return;
    
    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      active: true,
      phase,
      counters: { shots: 0, strips: 0 },
    };
    
    const updated = createProject(newProject);
    onProjectsUpdate(updated);
    setName('');
    setPhase('pre');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">New Project</h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[var(--neutral-700)] hover:bg-opacity-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                  className="input"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phase</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value as typeof phase)}
                  className="input"
                >
                  <option value="pre">Pre-production</option>
                  <option value="prod">Production</option>
                  <option value="wrap">Wrap</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleCreate} className="btn btn-primary" disabled={!name.trim()}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}