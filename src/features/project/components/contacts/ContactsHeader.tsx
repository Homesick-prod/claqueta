'use client';

import { UserPlus, Users } from 'lucide-react';

interface ContactsHeaderProps {
  onInviteClick: () => void;
  pendingCount: number;
}

export default function ContactsHeader({ onInviteClick, pendingCount }: ContactsHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--brand)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Contacts & Roles</h1>
            <p className="text-sm text-[var(--text-muted)]">
              Manage team members and their access levels
            </p>
          </div>
        </div>
        <button
          onClick={onInviteClick}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite People</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-[var(--accent)] text-black rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}