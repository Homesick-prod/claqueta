'use client';

import { useState, useEffect } from 'react';
import { X, Users, Shield, Check } from 'lucide-react';
import { FeaturePolicy, FeatureKey, Contact, PositionRef } from '../model';

interface FeatureAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureKey: FeatureKey | null;
  currentPolicy: FeaturePolicy | null;
  contacts: Contact[];
  positions: PositionRef[];
  onSave: (policy: FeaturePolicy) => void;
}

const FEATURE_NAMES: Record<FeatureKey, string> = {
  script: 'Script',
  breakdown: 'Breakdown', 
  moodboard: 'Moodboard',
  storyboard: 'Storyboard',
  floorplan: 'Floor Plan',
  shotlist: 'Shot List',
  stripboard: 'Stripboard',
  calendar: 'Calendar',
  contacts: 'Contacts',
  tasks: 'Tasks',
  budget: 'Budget',
  notes: 'Notes',
  callsheet: 'Call Sheets',
  assets: 'Assets',
  integrations: 'Integrations'
};

export default function FeatureAccessModal({
  isOpen,
  onClose,
  featureKey,
  currentPolicy,
  contacts,
  positions,
  onSave
}: FeatureAccessModalProps) {
  const [mode, setMode] = useState<'ALL_EDITORS' | 'RESTRICTED'>('ALL_EDITORS');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && featureKey) {
      if (currentPolicy) {
        setMode(currentPolicy.mode);
        setSelectedPositions(currentPolicy.allowPositions || []);
        setSelectedUsers(currentPolicy.allowUserIds || []);
      } else {
        setMode('ALL_EDITORS');
        setSelectedPositions([]);
        setSelectedUsers([]);
      }
    }
  }, [isOpen, featureKey, currentPolicy]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !featureKey) return null;

  const togglePosition = (positionId: string) => {
    setSelectedPositions(prev =>
      prev.includes(positionId)
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    );
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = () => {
    const policy: FeaturePolicy = {
      feature: featureKey,
      mode,
      allowPositions: mode === 'RESTRICTED' ? selectedPositions : undefined,
      allowUserIds: mode === 'RESTRICTED' ? selectedUsers : undefined
    };
    
    onSave(policy);
    onClose();
  };

  const getPreviewText = () => {
    if (mode === 'ALL_EDITORS') {
      return 'All editors will have access to this feature.';
    }

    const restrictions: string[] = [];
    if (selectedPositions.length > 0) {
      restrictions.push(`${selectedPositions.length} position${selectedPositions.length !== 1 ? 's' : ''}`);
    }
    if (selectedUsers.length > 0) {
      restrictions.push(`${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''}`);
    }

    if (restrictions.length === 0) {
      return 'No one will have access to this feature except owners.';
    }

    return `Access restricted to ${restrictions.join(' and ')}.`;
  };

  // Group positions by department
  const departments = [...new Set(positions.map(p => p.departmentId))];
  const positionsByDept = departments.reduce((acc, deptId) => {
    const deptPositions = positions.filter(p => p.departmentId === deptId);
    if (deptPositions.length > 0) {
      acc[deptId] = deptPositions;
    }
    return acc;
  }, {} as Record<string, PositionRef[]>);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[80vh] z-50">
        <div className="card h-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)] flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold">Access Control</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Configure access for {FEATURE_NAMES[featureKey]}
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

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Mode Selection */}
              <div>
                <h3 className="font-medium mb-3">Access Mode</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`
                    flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors
                    ${mode === 'ALL_EDITORS' 
                      ? 'bg-[var(--brand)]/10 border-[var(--brand)]/30' 
                      : 'border-[var(--border)] hover:bg-[var(--neutral-700)]/10'
                    }
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${mode === 'ALL_EDITORS' 
                        ? 'bg-[var(--brand)] border-[var(--brand)]' 
                        : 'border-[var(--border)]'
                      }
                    `}>
                      {mode === 'ALL_EDITORS' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <Users className="w-4 h-4" />
                        All Editors
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Everyone with editor access can use this feature
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="mode"
                      value="ALL_EDITORS"
                      checked={mode === 'ALL_EDITORS'}
                      onChange={() => setMode('ALL_EDITORS')}
                      className="sr-only"
                    />
                  </label>

                  <label className={`
                    flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors
                    ${mode === 'RESTRICTED' 
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30' 
                      : 'border-[var(--border)] hover:bg-[var(--neutral-700)]/10'
                    }
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${mode === 'RESTRICTED' 
                        ? 'bg-[var(--accent)] border-[var(--accent)]' 
                        : 'border-[var(--border)]'
                      }
                    `}>
                      {mode === 'RESTRICTED' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <Shield className="w-4 h-4" />
                        Restricted
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Only selected positions and users
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="mode"
                      value="RESTRICTED"
                      checked={mode === 'RESTRICTED'}
                      onChange={() => setMode('RESTRICTED')}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Restricted Mode Options */}
              {mode === 'RESTRICTED' && (
                <div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Positions */}
                    <div>
                      <h4 className="font-medium mb-3">Positions</h4>
                      <div className="border border-[var(--border)] rounded-lg">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          <div className="p-3 space-y-4">
                            {Object.entries(positionsByDept).map(([deptId, deptPositions]) => (
                              <div key={deptId}>
                                <h5 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                  {deptId.replace('-', ' ')}
                                </h5>
                                <div className="space-y-1">
                                  {deptPositions.map(position => (
                                    <div
                                      key={position.id}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        togglePosition(position.id);
                                      }}
                                      className="flex items-center gap-3 p-2 rounded hover:bg-[var(--neutral-700)]/10 cursor-pointer transition-colors"
                                    >
                                      <div className={`
                                        w-4 h-4 rounded border flex items-center justify-center transition-colors
                                        ${selectedPositions.includes(position.id)
                                          ? 'bg-[var(--brand)] border-[var(--brand)]'
                                          : 'border-[var(--border)]'
                                        }
                                      `}>
                                        {selectedPositions.includes(position.id) && 
                                          <Check className="w-3 h-3 text-white" />
                                        }
                                      </div>
                                      <span className="text-sm select-none">{position.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Users */}
                    <div>
                      <h4 className="font-medium mb-3">Individual Users</h4>
                      <div className="border border-[var(--border)] rounded-lg">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          <div className="p-3 space-y-1">
                            {contacts.map(contact => (
                              <div
                                key={contact.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleUser(contact.id);
                                }}
                                className="flex items-center gap-3 p-2 rounded hover:bg-[var(--neutral-700)]/10 cursor-pointer transition-colors"
                              >
                                <div className={`
                                  w-4 h-4 rounded border flex items-center justify-center transition-colors
                                  ${selectedUsers.includes(contact.id)
                                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                                    : 'border-[var(--border)]'
                                  }
                                `}>
                                  {selectedUsers.includes(contact.id) && 
                                    <Check className="w-3 h-3 text-white" />
                                  }
                                </div>
                                <div className="min-w-0 flex-1 select-none">
                                  <div className="text-sm font-medium truncate">{contact.name}</div>
                                  <div className="text-xs text-[var(--text-muted)] truncate">{contact.email}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="p-4 bg-[var(--neutral-700)]/10 border border-[var(--border)] rounded-lg">
                <div className="text-sm font-medium mb-1">Preview</div>
                <div className="text-sm text-[var(--text-muted)]">{getPreviewText()}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-[var(--border)] flex-shrink-0">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
            >
              Save Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}