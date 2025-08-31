'use client';

import { useState, useEffect, use } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/features/project/components/Sidebar';
import ProjectHeader from '@/features/project/components/ProjectHeader';
import HamburgerButton from '@/features/project/components/HamburgerButton';
import { useLocalStorage } from '@/features/project/hooks/useLocalStorage';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [collapsed, setCollapsed] = useLocalStorage('projectSidebarCollapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setCollapsed(prev => !prev);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };

    const handleStorageChange = () => {
      // Sync collapsed state when changed from sidebar
      const stored = localStorage.getItem('projectSidebarCollapsed');
      if (stored !== null) {
        setCollapsed(JSON.parse(stored));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mobileOpen, setCollapsed]);

  return (
    <div className="flex h-screen bg-[var(--page-bg)]">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[var(--surface)] backdrop-blur-xl bg-opacity-95 dark:bg-opacity-90 border-b border-[var(--neutral-800)]/30 dark:border-[var(--neutral-800)] z-30 flex items-center px-4 shadow-sm">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/[0.02] via-transparent to-[var(--accent)]/[0.02] pointer-events-none" />
        
        <div className="relative flex items-center gap-4 flex-1">
          <HamburgerButton
            isOpen={mobileOpen || !collapsed}
            onToggle={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(!mobileOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
          />
          <Link
            href="/hub"
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Projects</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <ProjectHeader projectId={resolvedParams.id} />
        </div>
        <div className="flex-1" />
      </div>

      {/* Sidebar */}
      <aside
        data-collapsed={collapsed}
        className={`
          fixed lg:relative top-16 left-0 h-[calc(100vh-4rem)] 
          bg-[var(--surface)] backdrop-blur-xl bg-opacity-95 dark:bg-opacity-100
          border-r border-[var(--neutral-800)]/30 dark:border-[var(--neutral-800)]
          shadow-xl lg:shadow-md
          shrink-0 transition-all duration-500 ease-out z-40
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        role={mobileOpen ? 'dialog' : undefined}
        aria-label="Project navigation"
      >
        {/* Subtle gradient overlay for sidebar */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/[0.02] via-transparent to-[var(--accent)]/[0.02] pointer-events-none" />
        <Sidebar projectId={resolvedParams.id} collapsed={collapsed} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}