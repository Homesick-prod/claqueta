'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getProjectMenu } from '../menu/config';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SidebarProps {
  projectId: string;
  collapsed?: boolean;
}

export default function Sidebar({ projectId, collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const menuGroups = getProjectMenu(projectId);
  
  const [preprodOpen, setPreprodOpen] = useLocalStorage('preprodOpen', true);
  const [prodOpen, setProdOpen] = useLocalStorage('prodOpen', false);
  const [wrapOpen, setWrapOpen] = useLocalStorage('wrapOpen', false);
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);

  useEffect(() => {
    setLocalCollapsed(collapsed);
  }, [collapsed]);

  const toggleGroup = (group: string) => {
    // When collapsed, expand sidebar first
    if (localCollapsed) {
      setLocalCollapsed(false);
      // Save to localStorage to sync with parent
      if (typeof window !== 'undefined') {
        localStorage.setItem('projectSidebarCollapsed', JSON.stringify(false));
        // Dispatch event to notify parent
        window.dispatchEvent(new Event('storage'));
      }
    }

    switch (group) {
      case 'Pre-production':
        setPreprodOpen(!preprodOpen);
        break;
      case 'Production':
        setProdOpen(!prodOpen);
        break;
      case 'Wrap':
        setWrapOpen(!wrapOpen);
        break;
    }
  };

  const isGroupOpen = (group: string) => {
    switch (group) {
      case 'Pre-production':
        return preprodOpen;
      case 'Production':
        return prodOpen;
      case 'Wrap':
        return wrapOpen;
      default:
        return false;
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="h-full py-4 overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.02] dark:to-black/[0.05] pointer-events-none" />
      
      <div 
        className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative"
      >
        {menuGroups.map((group, index) => {
          const Icon = group.icon;
          const isOpen = isGroupOpen(group.title);
          const hasActiveChild = group.children?.some(item => isActive(item.href));
          const isTopLevel = !group.children;

          if (isTopLevel) {
            // Top-level item
            return (
              <div key={group.title} className={`relative ${collapsed ? 'mb-3' : 'mb-1'}`}>
                {isActive(group.href) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--brand)] rounded-r-sm transition-all duration-500 ease-out" />
                )}
                <Link
                  href={group.href}
                  className={`
                    group relative flex items-center gap-3 rounded-lg overflow-hidden
                    transition-all duration-500 ease-out transform-gpu
                    ${collapsed ? 'justify-center px-3 py-3 mx-1' : 'px-3 py-2 mx-2'}
                    ${isActive(group.href) 
                      ? 'bg-[var(--brand)]/10 dark:bg-[var(--brand)]/15 text-[var(--brand)] shadow-sm' 
                      : 'hover:bg-[var(--neutral-700)]/10 dark:hover:bg-[var(--neutral-700)]/20 text-[var(--text)]'}
                  `}
                  title={collapsed ? group.title : undefined}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-[var(--brand)]/5 group-hover:to-transparent transition-all duration-500" />
                  <Icon className={`
                    relative shrink-0 transform-gpu transition-all duration-500 ease-out
                    ${collapsed ? 'w-6 h-6 scale-110' : 'w-5 h-5 scale-100'} 
                    ${isActive(group.href) ? 'text-[var(--brand)]' : ''}
                  `} />
                  <span className={`
                    relative text-sm font-medium transition-all duration-500 ease-out
                    ${collapsed ? 'w-0 opacity-0 scale-95' : 'w-auto opacity-100 scale-100'}
                  `}>
                    {group.title}
                  </span>
                </Link>
              </div>
            );
          }

          // Collapsible group
          return (
            <div key={group.title} className={`${collapsed ? 'mb-3' : 'mb-1'}`}>
              <div className="relative">
                {hasActiveChild && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--brand)] rounded-r-sm transition-all duration-500 ease-out" />
                )}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`
                    group relative w-full flex items-center gap-3 rounded-lg overflow-hidden
                    transition-all duration-500 ease-out transform-gpu
                    ${collapsed ? 'justify-center px-3 py-3 mx-1' : 'justify-between px-3 py-2 mx-2'}
                    ${hasActiveChild 
                      ? 'bg-[var(--brand)]/10 dark:bg-[var(--brand)]/15 text-[var(--brand)] shadow-sm' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-700)]/10 dark:hover:bg-[var(--neutral-700)]/20'}
                  `}
                  aria-expanded={isOpen}
                  title={collapsed ? group.title : undefined}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-[var(--brand)]/5 group-hover:to-transparent transition-all duration-500" />
                  <div className="relative flex items-center gap-3">
                    <Icon className={`
                      shrink-0 transform-gpu transition-all duration-500 ease-out
                      ${collapsed ? 'w-6 h-6 scale-110' : 'w-5 h-5 scale-100'} 
                      ${hasActiveChild ? 'text-[var(--brand)]' : ''}
                    `} />
                    <span className={`
                      text-sm font-semibold transition-all duration-500 ease-out
                      ${collapsed ? 'w-0 opacity-0 scale-95' : 'w-auto opacity-100 scale-100'}
                    `}>
                      {group.title}
                    </span>
                  </div>
                  {!collapsed && (
                    <ChevronDown className={`relative w-4 h-4 transition-all duration-500 ease-out ${!isOpen ? '-rotate-90' : 'rotate-0'}`} />
                  )}
                </button>
              </div>

              {isOpen && !collapsed && group.children && (
                <div className="mt-1 animate-in slide-in-from-top-2 duration-500">
                  {group.children.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={item.href} className="relative">
                        {isActive(item.href) && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--brand)] rounded-r-sm transition-all duration-500 ease-out" />
                        )}
                        <Link
                          href={item.href}
                          className={`
                            group relative flex items-center gap-3 pl-11 pr-3 py-2 mx-2 rounded-lg overflow-hidden
                            transition-all duration-500 ease-out text-sm
                            ${isActive(item.href)
                              ? 'bg-[var(--brand)]/10 dark:bg-[var(--brand)]/15 text-[var(--brand)] shadow-sm'
                              : 'hover:bg-[var(--neutral-700)]/10 dark:hover:bg-[var(--neutral-700)]/20 text-[var(--text-muted)] hover:text-[var(--text)]'}
                          `}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-[var(--brand)]/5 group-hover:to-transparent transition-all duration-500" />
                          <ItemIcon className={`relative w-4 h-4 shrink-0 ${isActive(item.href) ? 'text-[var(--brand)]' : ''}`} />
                          <span className="relative">{item.title}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}