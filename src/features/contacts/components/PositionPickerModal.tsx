'use client';

import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Contact, Department, PositionRef } from '../model';

interface PositionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  departments: Department[];
  positions: PositionRef[];
  onSave: (contactId: string, selectedPositions: PositionRef[]) => void;
}

export default function PositionPickerModal({
  isOpen,
  onClose,
  contact,
  departments,
  positions,
  onSave
}: PositionPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPositions, setSelectedPositions] = useState<PositionRef[]>([]);

  // Initialize selected positions when modal opens
  useEffect(() => {
    if (isOpen && contact) {
      setSelectedPositions([...contact.positions]);
    }
  }, [isOpen, contact]);

  // Close modal on escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !contact) return null;

  // Filter positions based on search and department
  const filteredPositions = positions.filter(position => {
    const matchesSearch = !searchQuery || 
      position.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || 
      position.departmentId === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Group positions by department
  const positionsByDepartment = departments.reduce((acc, dept) => {
    const deptPositions = filteredPositions.filter(p => p.departmentId === dept.id);
    if (deptPositions.length > 0) {
      acc[dept.id] = {
        department: dept,
        positions: deptPositions
      };
    }
    return acc;
  }, {} as Record<string, { department: Department; positions: PositionRef[] }>);

  const togglePosition = (position: PositionRef) => {
    const isSelected = selectedPositions.some(p => p.id === position.id);
    if (isSelected) {
      setSelectedPositions(prev => prev.filter(p => p.id !== position.id));
    } else {
      setSelectedPositions(prev => [...prev, position]);
    }
  };

  const handleSave = () => {
    onSave(contact.id, selectedPositions);
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[80vh] z-50">
        <div className="card h-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)] flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold">Select Positions</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Choose positions for {contact.name}
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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input sm:w-auto"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Selected Count */}
          <div className="px-6 py-2 text-sm text-[var(--text-muted)] border-b border-[var(--border)] flex-shrink-0">
            {selectedPositions.length} position{selectedPositions.length !== 1 ? 's' : ''} selected
          </div>

          {/* Positions List - Fixed height scrollable area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">{Object.values(positionsByDepartment).map(({ department, positions: deptPositions }) => (
                <div key={department.id}>
                  <h3 className="font-medium text-sm text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    {department.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {deptPositions.map(position => {
                      const isSelected = selectedPositions.some(p => p.id === position.id);
                      return (
                        <div
                          key={position.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            togglePosition(position);
                          }}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                            ${isSelected 
                              ? 'bg-[var(--brand)]/10 border-[var(--brand)]/30' 
                              : 'border-[var(--border)] hover:bg-[var(--neutral-700)]/10'
                            }
                          `}
                        >
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                            ${isSelected 
                              ? 'bg-[var(--brand)] border-[var(--brand)]' 
                              : 'border-[var(--border)]'
                            }
                          `}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-medium select-none">{position.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {Object.keys(positionsByDepartment).length === 0 && (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  <p>No positions found</p>
                  {(searchQuery || selectedDepartment) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDepartment('');
                      }}
                      className="btn btn-ghost mt-2 text-sm"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
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
              Save Positions ({selectedPositions.length})
            </button>
          </div>
        </div>
      </div>
    </>
  );
}