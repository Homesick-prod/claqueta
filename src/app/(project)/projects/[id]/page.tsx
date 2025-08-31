'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Film, 
  Calendar, 
  Users, 
  ChevronRight, 
  Plus,
  Command,
  Camera,
  CheckSquare,
  Phone,
  CalendarDays,
  Upload
} from 'lucide-react';
import { getProjects } from '@/features/project/lib/projects-local';
import { Project } from '@/features/project/types/domain';

export default function ProjectHomePage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  useEffect(() => {
    const projects = getProjects();
    const found = projects.find((p) => p.id === projectId);
    setProject(found || null);
  }, [projectId]);

  // Quick Actions keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickActionsOpen(true);
      }
      if (e.key === 'Escape') {
        setQuickActionsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    console.log('Quick action:', action);
    setQuickActionsOpen(false);
    // TODO: Implement actual actions (create shot, task, etc.)
  }, []);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)]">Project not found</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { id: 'shot', label: 'Create Shot', icon: Camera, shortcut: 'S' },
    { id: 'task', label: 'Create Task', icon: CheckSquare, shortcut: 'T' },
    { id: 'callsheet', label: 'Create Call Sheet', icon: Phone, shortcut: 'C' },
    { id: 'day', label: 'Create Day', icon: CalendarDays, shortcut: 'D' },
    { id: 'import', label: 'Import Data', icon: Upload, shortcut: 'I' },
  ];

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <button
            onClick={() => setQuickActionsOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Quick Actions
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-black/20 rounded">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <span className="chip chip-{project.phase || 'pre'}">
            {project.phase === 'pre' ? 'Pre-production' : 
             project.phase === 'prod' ? 'Production' : 'Wrap'}
          </span>
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tabular">{project.counters?.shots || 0}</p>
              <p className="text-sm text-[var(--text-muted)]">Total Shots</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Film className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tabular">{project.counters?.strips || 0}</p>
              <p className="text-sm text-[var(--text-muted)]">Script Strips</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tabular">0</p>
              <p className="text-sm text-[var(--text-muted)]">Shooting Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href={`/projects/${projectId}/shots`} className="card p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <p className="font-medium">Shot List</p>
                <p className="text-sm text-[var(--text-muted)]">Manage all project shots</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href={`/projects/${projectId}/schedule`} className="card p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <p className="font-medium">Schedule</p>
                <p className="text-sm text-[var(--text-muted)]">View production calendar</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href={`/projects/${projectId}/contacts`} className="card p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <p className="font-medium">Contacts & Roles</p>
                <p className="text-sm text-[var(--text-muted)]">Manage team members</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Quick Actions Modal */}
      {quickActionsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setQuickActionsOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
            <div className="card p-1">
              <div className="p-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Command className="w-4 h-4" />
                  <span>Quick Actions</span>
                </div>
              </div>
              <div className="py-1">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-[var(--neutral-700)]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">{action.label}</span>
                      </div>
                      <kbd className="px-1.5 py-0.5 text-xs bg-[var(--neutral-700)]/30 rounded">
                        {action.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}