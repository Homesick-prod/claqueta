'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Link, Copy, Check } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Contact } from '../model';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

export default function InviteModal({ isOpen, onClose, contact }: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'link'>('email');
  const [emailBody, setEmailBody] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate invite link and email template
  useEffect(() => {
    if (isOpen && contact) {
      const linkId = nanoid();
      setInviteLink(`https://claqueta.app/invite/${linkId}`);
      
      setEmailBody(`Hi ${contact.name || 'there'},

You've been invited to collaborate on our film production project in Claqueta.

Click here to join: https://claqueta.app/invite/${linkId}

Looking forward to working with you!

Best regards,
The Production Team`);
    }
  }, [isOpen, contact]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !contact) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleSendEmail = () => {
    // Mock send email action
    alert('Email invite sent! (This is a mock implementation)');
    onClose();
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
        <div className="card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Invite {contact.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Send an invitation to join the project
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="segment mb-6">
            <button
              onClick={() => setActiveTab('email')}
              className={`segment-item ${activeTab === 'email' ? 'segment-item-active' : ''}`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Invite via Email
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`segment-item ${activeTab === 'link' ? 'segment-item-active' : ''}`}
            >
              <Link className="w-4 h-4 mr-2" />
              Invite via Link
            </button>
          </div>

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <input
                  type="email"
                  value={contact.email}
                  readOnly
                  className="input bg-[var(--neutral-700)]/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  className="input resize-none"
                  placeholder="Enter your invitation message..."
                />
              </div>

              <div className="p-3 bg-[var(--brand)]/10 rounded-lg">
                <p className="text-sm text-[var(--brand)]">
                  <strong>Mock only</strong> — Backend not connected. This is a demonstration of the UI.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="btn btn-primary"
                  disabled={!contact.email || !emailBody.trim()}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Invitation Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="input flex-1 bg-[var(--neutral-700)]/20 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteLink)}
                    className={`btn ${copied ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[var(--neutral-700)]/10 rounded-lg">
                <h4 className="text-sm font-medium mb-2">How to use this link:</h4>
                <ul className="text-sm text-[var(--text-muted)] space-y-1">
                  <li>• Share this link directly with {contact.name}</li>
                  <li>• The link will grant them access to the project</li>
                  <li>• Links expire after 7 days for security</li>
                </ul>
              </div>

              <div className="p-3 bg-[var(--brand)]/10 rounded-lg">
                <p className="text-sm text-[var(--brand)]">
                  <strong>Mock only</strong> — This is a placeholder link for demonstration purposes.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}