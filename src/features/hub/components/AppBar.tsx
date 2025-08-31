'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, BookOpen, User, ChevronDown } from 'lucide-react';
import NotificationsPopover from './NotificationsPopover';
import ContactsPopover from './ContactsPopover';

export default function AppBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <div className="topbar">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xl sm:text-2xl font-bold text-[var(--brand)]">Claqueta</div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-[var(--neutral-700)] hover:bg-opacity-20 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowContacts(!showContacts)}
            className="relative p-2 rounded-lg hover:bg-[var(--neutral-700)] hover:bg-opacity-20 transition-colors"
            aria-label="Contacts"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-[var(--neutral-700)] hover:bg-opacity-20 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">Beta Tester</span>
              <ChevronDown className="hidden sm:inline w-4 h-4" />
            </button>
            
            {showUserMenu && (
              <div className="menu top-full right-0 mt-2">
                <button className="menu-item">Profile</button>
                <button className="menu-item">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <NotificationsPopover
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      <ContactsPopover
        isOpen={showContacts}
        onClose={() => setShowContacts(false)}
      />
    </div>
  );
}