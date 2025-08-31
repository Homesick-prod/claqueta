'use client';

import React from 'react';
import { ALLOWED_SLOTS } from '@/types/domain';

interface UsageBarProps {
  activeCount: number;
  onManage: () => void;
}

export default function UsageBar({ activeCount, onManage }: UsageBarProps) {
  const percentage = Math.min((activeCount / ALLOWED_SLOTS) * 100, 100);
  
  return (
    <div className="flex items-center justify-end gap-4 mb-6">
      <div className="usage-bar">
        <span className="text-sm text-[var(--text-muted)]">
          Active {activeCount} / Allowed {ALLOWED_SLOTS}
        </span>
        <div className="usage-progress w-32">
          <div className="usage-fill" style={{ width: `${percentage}%` }} />
        </div>
        <button onClick={onManage} className="btn-ghost text-sm">
          Manage
        </button>
      </div>
    </div>
  );
}