'use client';

import { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, FileText, Crown, Shield, Eye } from 'lucide-react';
import { Contact, ProjectRole } from '../model';
import { canChangeRole, canDeleteContact } from '../guard';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  contacts: Contact[];
  onUpdateContact: (id: string, patch: Partial<Contact>) => void;
  onRemoveContact: (id: string) => void;
}

export default function ContactDrawer({
  isOpen,
  onClose,
  contact,
  contacts,
  onUpdateContact,
  onRemoveContact
}: ContactDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    role: 'VIEWER' as ProjectRole
  });
  const [hasChanges, setHasChanges] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when contact changes
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        notes: contact.notes || '',
        role: contact.role
      });
      setHasChanges(false);
    }
  }, [contact]);

  // Focus name input when drawer opens with a new contact
  useEffect(() => {
    if (isOpen && contact && !contact.name && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen, contact]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (hasChanges) {
          if (confirm('You have unsaved changes. Are you sure you want to close?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, hasChanges, onClose]);

  if (!isOpen || !contact) return null;

  const handleInputChange = (field: keyof typeof formData, value: string | ProjectRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      // Validate role change if applicable
      if (formData.role !== contact.role) {
        const roleValidation = canChangeRole(contact.id, formData.role, contacts);
        if (!roleValidation.canChange) {
          alert(roleValidation.reason);
          return;
        }
      }

      onUpdateContact(contact.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        notes: formData.notes.trim(),
        role: formData.role
      });
      
      setHasChanges(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save contact');
    }
  };

  const handleDelete = () => {
    try {
      const validation = canDeleteContact(contact.id, contacts);
      if (!validation.canDelete) {
        alert(validation.reason);
        return;
      }
      
      if (confirm(`Are you sure you want to delete ${contact.name || 'this contact'}?`)) {
        onRemoveContact(contact.id);
        onClose();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete contact');
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const getRoleIcon = (role: ProjectRole) => {
    switch (role) {
      case 'OWNER': return Crown;
      case 'EDITOR': return Shield;
      case 'VIEWER': return Eye;
      case 'GUEST': return User;
    }
  };

  const RoleIcon = getRoleIcon(formData.role);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300">
        <div className="h-full bg-[var(--surface)] shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--brand)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {contact.name || 'New Contact'}
                </h2>
                {contact.isPrimaryOwner && (
                  <div className="flex items-center gap-1 text-xs text-[var(--accent)]">
                    <Crown className="w-3 h-3" />
                    Primary Owner
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="btn-ghost p-2"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name *
                  </div>
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="input"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </div>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="input"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="input"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <RoleIcon className="w-4 h-4" />
                    Project Role
                  </div>
                </label>
                {contact.isPrimaryOwner ? (
                  <div className="input bg-[var(--neutral-700)]/20 flex items-center gap-2 text-[var(--text-muted)]">
                    <Crown className="w-4 h-4 text-[var(--accent)]" />
                    Primary Owner (cannot be changed)
                  </div>
                ) : (
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value as ProjectRole)}
                    className="input"
                  >
                    <option value="OWNER">Owner - Full project control</option>
                    <option value="EDITOR">Editor - Can edit project content</option>
                    <option value="VIEWER">Viewer - Can view project content</option>
                    <option value="GUEST">Guest - Limited access</option>
                  </select>
                )}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </div>
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this contact..."
                  rows={4}
                  className="input resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                {!contact.isPrimaryOwner && (
                  <button
                    onClick={handleDelete}
                    className="btn btn-ghost text-red-500 text-sm"
                  >
                    Delete Contact
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="btn btn-secondary"
                >
                  {hasChanges ? 'Cancel' : 'Close'}
                </button>
                <button
                  onClick={handleSave}
                  className={`btn ${hasChanges ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}