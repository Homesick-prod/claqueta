'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Project, ALLOWED_SLOTS } from '../../../types/domain';
import { updateProject, getProjects } from '../../../lib/projects-local';

interface ManageSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
}

export default function ManageSlotsModal({ isOpen, onClose, projects, onProjectsUpdate }: ManageSlotsModalProps) {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(projects.filter(p => p.active && !p.archived).map(p => p.id))
  );

  const handleToggle = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      if (newSelected.size < ALLOWED_SLOTS) {
        newSelected.add(projectId);
      }
    }
    setSelectedProjects(newSelected);
  };

  const handleSave = () => {
    const updatedProjects = projects.map(p => ({
      ...p,
      active: selectedProjects.has(p.id),
    }));
    
    updatedProjects.forEach(p => {
      updateProject(p.id, { active: p.active });
    });
    
    onProjectsUpdate(getProjects());
    onClose();
  };

  const nonArchivedProjects = projects.filter(p => !p.archived);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Active Slots</h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[var(--neutral-700)] hover:bg-opacity-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-[var(--brand)] bg-opacity-10 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-[var(--brand)] mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Slot Limit: {ALLOWED_SLOTS} active projects</p>
                <p className="text-[var(--text-muted)]">
                  You can have up to {ALLOWED_SLOTS} active projects at a time. Archive projects to free up slots.
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              {nonArchivedProjects.map(project => (
                <label
                  key={project.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--neutral-700)] hover:bg-opacity-10 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.has(project.id)}
                    onChange={() => handleToggle(project.id)}
                    disabled={!selectedProjects.has(project.id) && selectedProjects.size >= ALLOWED_SLOTS}
                    className="w-4 h-4 rounded text-[var(--brand)]"
                  />
                  <span className="flex-1">{project.name}</span>
                  {project.phase && (
                    <span className={`chip-${project.phase === 'pre' ? 'pre' : project.phase === 'prod' ? 'prod' : 'wrap'}`}>
                      {project.phase === 'pre' ? 'Pre-prod' : project.phase === 'prod' ? 'Prod' : 'Wrap'}
                    </span>
                  )}
                </label>
              ))}
            </div>
            
            <div className="text-sm text-center mb-4">
              Selected: {selectedProjects.size} / {ALLOWED_SLOTS}
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}