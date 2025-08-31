'use client';

import { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Mail } from 'lucide-react';
import { Role } from '@/features/project/types';

interface InvitePeopleModalProps {
  onClose: () => void;
  onInvite: (emails: string[], role: Role) => void;
}

export default function InvitePeopleModal({ onClose, onInvite }: InvitePeopleModalProps) {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus first input on mount
    firstInputRef.current?.focus();

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const validateEmails = (input: string): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailList = input
      .split(/[\n,;]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const validEmails: string[] = [];
    const invalidEmails: string[] = [];

    emailList.forEach(email => {
      if (emailRegex.test(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    });

    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(', ')}`);
      return [];
    }

    return validEmails;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validEmails = validateEmails(emails);
    if (validEmails.length === 0 && emails.trim()) {
      return;
    }

    if (validEmails.length === 0) {
      setError('Please enter at least one email address');
      return;
    }

    onInvite(validEmails, role);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
        <div ref={modalRef} className="card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-[var(--brand)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Invite People</h2>
                <p className="text-sm text-[var(--text-muted)]">Add team members to your project</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--neutral-700)]/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="emails" className="block text-sm font-medium mb-2">
                  Email addresses
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[var(--text-muted)]" />
                  <textarea
                    ref={firstInputRef}
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="Enter email addresses (one per line or comma-separated)"
                    className="input pl-10 min-h-[100px] resize-none"
                    required
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Separate multiple emails with commas or new lines
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Access level
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="input"
                >
                  <option value="viewer">Viewer - Can view project content</option>
                  <option value="editor">Editor - Can edit project content</option>
                  <option value="guest">Guest - Limited access to specific areas</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  You can change access levels later
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Send Invites
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}