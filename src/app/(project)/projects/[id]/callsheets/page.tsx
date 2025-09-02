'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import CallsheetsHeaderCenter from '@/features/callsheet/components/CallsheetsHeaderCenter';
import SummaryPanel from '@/features/callsheet/components/SummaryPanel';
import CastPanel from '@/features/callsheet/components/CastPanel';
import CrewPanel from '@/features/callsheet/components/CrewPanel';
import NotesPanel from '@/features/callsheet/components/NotesPanel';
import ExportPDFButton from '@/features/callsheet/components/ExportPDFButton';
import { useCallSheetDoc } from '@/features/callsheet/useCallSheetDoc';

export default function CallSheetsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState<'summary' | 'cast' | 'crew' | 'notes'>('summary');
  
  const {
    doc,
    activePage,
    createPage,
    switchActivePage,
    renamePage,
    updatePage,
    isSaving
  } = useCallSheetDoc(projectId);

  // Get project name from localStorage
  const [projectName, setProjectName] = useState('');
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('filmProductionProjects');
      if (stored) {
        const projects = JSON.parse(stored);
        const project = projects.find((p: any) => p.id === projectId);
        if (project) {
          setProjectName(project.name || 'Untitled Project');
        }
      }
    } catch {
      setProjectName('Untitled Project');
    }
  }, [projectId]);

  if (!doc || !activePage) {
    return (
      <div className="min-h-screen bg-blueprint bg-vignette-soft flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)]">Loading call sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blueprint bg-vignette-soft">
      {/* Custom AppBar matching project layout */}
      <div className="topbar">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Hamburger + Back Button */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button className="p-2 rounded-lg hover:bg-[var(--neutral-800)]/30 transition-colors">
              <Menu className="w-5 h-5 text-[var(--text)]" />
            </button>
            <Link
              href={`/projects/${projectId}`}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Project</span>
            </Link>
          </div>
          
          {/* Center: Project Name / Call Sheet - Page */}
          <div className="flex-1 flex justify-center min-w-0">
            <CallsheetsHeaderCenter
              projectName={projectName}
              doc={doc}
              onCreatePage={createPage}
              onSwitch={switchActivePage}
              onRename={renamePage}
            />
          </div>
          
          {/* Right: Status + Export */}
          <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
            <div className="text-sm text-[var(--text-muted)]">
              {isSaving ? 'Saving...' : 'Saved'}
            </div>
            <ExportPDFButton page={activePage} projectName={projectName} />
          </div>
        </div>
      </div>
      
      <div className="pt-16">
        <div className="p-6 md:p-8">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="segment">
              <button
                onClick={() => setActiveTab('summary')}
                className={`segment-item ${activeTab === 'summary' ? 'segment-item-active' : ''}`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('cast')}
                className={`segment-item ${activeTab === 'cast' ? 'segment-item-active' : ''}`}
              >
                Cast
              </button>
              <button
                onClick={() => setActiveTab('crew')}
                className={`segment-item ${activeTab === 'crew' ? 'segment-item-active' : ''}`}
              >
                Crew
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`segment-item ${activeTab === 'notes' ? 'segment-item-active' : ''}`}
              >
                Notes
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="card p-6">
            {activeTab === 'summary' && (
              <SummaryPanel
                page={activePage}
                onUpdate={updatePage}
              />
            )}
            {activeTab === 'cast' && (
              <CastPanel
                page={activePage}
                onUpdate={updatePage}
              />
            )}
            {activeTab === 'crew' && (
              <CrewPanel
                page={activePage}
                onUpdate={updatePage}
                projectId={projectId}
              />
            )}
            {activeTab === 'notes' && (
              <NotesPanel
                page={activePage}
                onUpdate={updatePage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}