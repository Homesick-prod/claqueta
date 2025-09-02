'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Mail, 
  Phone, 
  Crown, 
  Shield, 
  Eye, 
  User,
  Trash2,
  Edit,
  Check,
  X,
  Send
} from 'lucide-react';
import { Contact, ProjectRole, Department, PositionRef } from '../model';
import { isEmailUnique, canDeleteContact, canChangeRole } from '../guard';
import PositionChips from './PositionChips';

interface MembersTableProps {
  contacts: Contact[];
  departments: Department[];
  positions: PositionRef[];
  onUpdateContact: (id: string, patch: Partial<Contact>) => void;
  onRemoveContact: (id: string) => void;
  onOpenPositionModal: (contactId: string) => void;
  onOpenInviteModal: (contactId: string) => void;
  highlightContactId?: string;
}

export default function MembersTable({
  contacts,
  departments,
  positions,
  onUpdateContact,
  onRemoveContact,
  onOpenPositionModal,
  onOpenInviteModal,
  highlightContactId
}: MembersTableProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingField]);

  const startEditing = (contactId: string, field: string, currentValue: string) => {
    const key = `${contactId}-${field}`;
    setEditingField(key);
    setEditValues({ ...editValues, [key]: currentValue });
  };

  const saveEdit = (contactId: string, field: string) => {
    const key = `${contactId}-${field}`;
    const newValue = editValues[key]?.trim() || '';
    
    // Validate email uniqueness
    if (field === 'email' && newValue) {
      if (!isEmailUnique(newValue, contactId, contacts)) {
        alert('This email is already in use by another contact.');
        return;
      }
    }

    // Validate required fields
    if ((field === 'name' || field === 'email') && !newValue) {
      alert(`${field === 'name' ? 'Name' : 'Email'} is required.`);
      return;
    }

    onUpdateContact(contactId, { [field]: newValue });
    setEditingField(null);
    setEditValues({ ...editValues, [key]: '' });
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleRoleChange = (contactId: string, newRole: ProjectRole) => {
    try {
      const validation = canChangeRole(contactId, newRole, contacts);
      if (!validation.canChange) {
        alert(validation.reason);
        return;
      }
      onUpdateContact(contactId, { role: newRole });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to change role');
    }
  };

  const handleRemove = (contactId: string) => {
    try {
      const validation = canDeleteContact(contactId, contacts);
      if (!validation.canDelete) {
        alert(validation.reason);
        return;
      }
      
      if (confirm('Are you sure you want to remove this contact?')) {
        onRemoveContact(contactId);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove contact');
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

  const getRoleColor = (role: ProjectRole) => {
    switch (role) {
      case 'OWNER': return 'text-[var(--accent)]';
      case 'EDITOR': return 'text-[var(--brand)]';
      case 'VIEWER': return 'text-blue-500';
      case 'GUEST': return 'text-[var(--text-muted)]';
    }
  };

  const getDepartmentsForContact = (contact: Contact): string[] => {
    const deptIds = [...new Set(contact.positions.map(p => p.departmentId))];
    return deptIds
      .map(id => departments.find(d => d.id === id)?.name)
      .filter(Boolean) as string[];
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Name</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Positions</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Department(s)</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Role</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Email</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Phone</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => {
              const RoleIcon = getRoleIcon(contact.role);
              const departments = getDepartmentsForContact(contact);
              const isHighlighted = contact.id === highlightContactId;
              
              return (
                <tr 
                  key={contact.id} 
                  className={`border-b border-[var(--border)] last:border-0 transition-colors ${
                    isHighlighted ? 'bg-[var(--brand)]/5' : ''
                  }`}
                >
                  {/* Name */}
                  <td className="p-4">
                    {editingField === `${contact.id}-name` ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editValues[`${contact.id}-name`] || ''}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [`${contact.id}-name`]: e.target.value
                          })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(contact.id, 'name');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="input text-sm min-w-0"
                          placeholder="Enter name..."
                        />
                        <button
                          onClick={() => saveEdit(contact.id, 'name')}
                          className="btn-ghost p-1 text-green-500"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn-ghost p-1 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEditing(contact.id, 'name', contact.name)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[var(--neutral-700)]/10 -m-1 p-1 rounded group"
                      >
                        <span className="font-medium">
                          {contact.name || (
                            <span className="text-[var(--text-muted)] italic">
                              Click to add name
                            </span>
                          )}
                        </span>
                        {contact.isPrimaryOwner && (
                          <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">
                            Primary Owner
                          </span>
                        )}
                        <Edit className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </td>

                  {/* Positions */}
                  <td className="p-4">
                    <PositionChips
                      positions={contact.positions}
                      onClick={() => onOpenPositionModal(contact.id)}
                    />
                  </td>

                  {/* Departments */}
                  <td className="p-4">
                    <div className="text-sm text-[var(--text-muted)]">
                      {departments.length > 0 ? departments.join(', ') : '—'}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    {contact.isPrimaryOwner ? (
                      <div className={`flex items-center gap-2 ${getRoleColor(contact.role)}`}>
                        <RoleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Owner</span>
                      </div>
                    ) : (
                      <select
                        value={contact.role}
                        onChange={(e) => handleRoleChange(contact.id, e.target.value as ProjectRole)}
                        className="input text-sm py-1 px-2 min-w-0"
                      >
                        <option value="OWNER">Owner</option>
                        <option value="EDITOR">Editor</option>
                        <option value="VIEWER">Viewer</option>
                        <option value="GUEST">Guest</option>
                      </select>
                    )}
                  </td>

                  {/* Email */}
                  <td className="p-4">
                    {editingField === `${contact.id}-email` ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          type="email"
                          value={editValues[`${contact.id}-email`] || ''}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [`${contact.id}-email`]: e.target.value
                          })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(contact.id, 'email');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="input text-sm min-w-0"
                          placeholder="Enter email..."
                        />
                        <button
                          onClick={() => saveEdit(contact.id, 'email')}
                          className="btn-ghost p-1 text-green-500"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn-ghost p-1 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEditing(contact.id, 'email', contact.email)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[var(--neutral-700)]/10 -m-1 p-1 rounded group"
                      >
                        <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">
                          {contact.email || (
                            <span className="text-[var(--text-muted)] italic">
                              Click to add email
                            </span>
                          )}
                        </span>
                        <Edit className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="p-4">
                    {editingField === `${contact.id}-phone` ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          type="tel"
                          value={editValues[`${contact.id}-phone`] || ''}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [`${contact.id}-phone`]: e.target.value
                          })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(contact.id, 'phone');
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="input text-sm min-w-0"
                          placeholder="Enter phone..."
                        />
                        <button
                          onClick={() => saveEdit(contact.id, 'phone')}
                          className="btn-ghost p-1 text-green-500"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn-ghost p-1 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEditing(contact.id, 'phone', contact.phone || '')}
                        className="flex items-center gap-2 cursor-pointer hover:bg-[var(--neutral-700)]/10 -m-1 p-1 rounded group"
                      >
                        <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">
                          {contact.phone || (
                            <span className="text-[var(--text-muted)] italic">
                              Click to add phone
                            </span>
                          )}
                        </span>
                        <Edit className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenInviteModal(contact.id)}
                        className="btn btn-primary text-xs px-2 py-1"
                        title="Invite"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Invite
                      </button>
                      
                      {!contact.isPrimaryOwner && (
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpen(menuOpen === contact.id ? null : contact.id)}
                            className="btn-ghost p-2"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {menuOpen === contact.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10"
                                onClick={() => setMenuOpen(null)}
                              />
                              <div className="menu right-0 top-full mt-1 z-20">
                                <button
                                  onClick={() => {
                                    handleRemove(contact.id);
                                    setMenuOpen(null);
                                  }}
                                  className="menu-item text-red-500"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}