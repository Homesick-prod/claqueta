'use client';

import { PendingInvite } from '@/features/project/types';
import { Mail, Clock, RefreshCw, X } from 'lucide-react';

interface PendingInvitesProps {
  invites: PendingInvite[];
  onCancel: (email: string) => void;
  onResend: (email: string) => void;
}

export default function PendingInvites({ invites, onCancel, onResend }: PendingInvitesProps) {
  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
      
      <div className="card overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {invites.map((invite) => (
            <div key={invite.email} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="font-medium">{invite.email}</p>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span className="capitalize">{invite.role}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Invited {formatDate(invite.invitedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onResend(invite.email)}
                  className="btn btn-ghost p-2"
                  title="Resend invite"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCancel(invite.email)}
                  className="btn btn-ghost p-2 text-red-500"
                  title="Cancel invite"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}