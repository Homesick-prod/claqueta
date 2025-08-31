'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import SettingsMenu from './SettingsMenu';

export default function SettingsFAB() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--brand)] text-white shadow-lg hover:bg-[var(--brand-700)] transition-colors flex items-center justify-center z-40"
        aria-label="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
      
      <SettingsMenu
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}