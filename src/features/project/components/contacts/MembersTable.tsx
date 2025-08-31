'use client';

import { useState } from 'react';
import { Member, Role } from '@/features/project/types';
import { 
  MoreVertical, 
  User, 
  Shield, 
  Crown,
  Clock,
  Mail,
  Briefcase
} from 'lucide-react';

interface MembersTableProps {
  members: Member[];
  currentUserId: string;
  onRoleChange: (memberId: string, role: Role) => void;
  onRemove: (memberId: string) => void;
  onTransferOwnership: (memberId: string) => void;
}

export default function MembersTable({ 
  members, 
  currentUserId,
  onRoleChange, 
  onRemove,
  onTransferOwnership 
}: MembersTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'owner': return Crown;
      case 'editor': return Shield;
      default: return User;
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'owner': return 'text-[var(--accent)]';
      case 'editor': return 'text-[var(--brand)]';
      case 'viewer': return 'text-blue-500';
      default: return 'text-[var(--text-muted)]';
    }
  };

  const formatLastActive = (date?: string) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const currentUser = members.find(m => m.id === currentUserId);
  const isCurrentUserOwner = currentUser?.role === 'owner';

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Team Members</h3>
      
      {/* Desktop Table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Member</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Role</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Department</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Access</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Last Active</th>
              <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <tr key={member.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {member.avatarUrl ? (
                        <img 
                          src={member.avatarUrl} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--neutral-700)] flex items-center justify-center">
                          <User className="w-5 h-5 text-[var(--text-muted)]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {isCurrentUserOwner && member.role !== 'owner' ? (
                      <select
                        value={member.role}
                        onChange={(e) => onRoleChange(member.id, e.target.value as Role)}
                        className="input py-1 px-2 text-sm"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                        <option value="guest">Guest</option>
                      </select>
                    ) : (
                      <div className={`flex items-center gap-2 ${getRoleColor(member.role)}`}>
                        <RoleIcon className="w-4 h-4" />
                        <span className="capitalize">{member.role}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{member.department || '—'}</p>
                    {member.title && (
                      <p className="text-xs text-[var(--text-muted)]">{member.title}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{member.access?.join(', ') || 'All areas'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <Clock className="w-4 h-4" />
                      <span>{formatLastActive(member.lastActiveAt)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {isCurrentUserOwner && member.id !== currentUserId && (
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                          className="p-2 hover:bg-[var(--neutral-700)]/20 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {menuOpen === member.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setMenuOpen(null)}
                            />
                            <div className="menu right-0 top-full mt-1">
                              {member.role !== 'owner' && (
                                <button
                                  onClick={() => {
                                    onTransferOwnership(member.id);
                                    setMenuOpen(null);
                                  }}
                                  className="menu-item"
                                >
                                  Transfer Ownership
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  onRemove(member.id);
                                  setMenuOpen(null);
                                }}
                                className="menu-item text-red-500"
                              >
                                Remove Member
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {members.map((member) => {
          const RoleIcon = getRoleIcon(member.role);
          return (
            <div key={member.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--neutral-700)] flex items-center justify-center">
                      <User className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{member.email}</p>
                  </div>
                </div>
                {isCurrentUserOwner && member.id !== currentUserId && (
                  <button
                    onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                    className="p-2 hover:bg-[var(--neutral-700)]/20 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Role</span>
                  {isCurrentUserOwner && member.role !== 'owner' ? (
                    <select
                      value={member.role}
                      onChange={(e) => onRoleChange(member.id, e.target.value as Role)}
                      className="input py-1 px-2 text-sm"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                      <option value="guest">Guest</option>
                    </select>
                  ) : (
                    <div className={`flex items-center gap-2 ${getRoleColor(member.role)}`}>
                      <RoleIcon className="w-4 h-4" />
                      <span className="capitalize">{member.role}</span>
                    </div>
                  )}
                </div>

                {(member.department || member.title) && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Department</span>
                    <span>{member.department || member.title || '—'}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Last Active</span>
                  <span>{formatLastActive(member.lastActiveAt)}</span>
                </div>
              </div>

              {/* Mobile Menu */}
              {menuOpen === member.id && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(null)}
                  />
                  <div className="menu left-4 right-4 bottom-4">
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => {
                          onTransferOwnership(member.id);
                          setMenuOpen(null);
                        }}
                        className="menu-item"
                      >
                        Transfer Ownership
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onRemove(member.id);
                        setMenuOpen(null);
                      }}
                      className="menu-item text-red-500"
                    >
                      Remove Member
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}