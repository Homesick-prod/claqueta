'use client';

import { Users, Plus, Trash2, UserPlus, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CallSheetPage } from '../model';
import { getMembers } from '@/lib/projects-local';
import { Member } from '@/features/project/types';
import TimePicker from './TimePicker';

interface CrewPanelProps {
  page: CallSheetPage;
  onUpdate: (patch: Partial<CallSheetPage>) => void;
  projectId: string;
}

const DEFAULT_DEPARTMENTS = [
  { id: 'direction', name: 'Direction' },
  { id: 'camera', name: 'Camera' },
  { id: 'sound', name: 'Sound' },
  { id: 'lighting', name: 'Lighting/Electric' },
  { id: 'grip', name: 'Grip' },
  { id: 'production', name: 'Production' },
  { id: 'art', name: 'Art Department' },
  { id: 'makeup', name: 'Makeup & Hair' },
  { id: 'wardrobe', name: 'Wardrobe/Costume' },
  { id: 'script', name: 'Script/Continuity' },
  { id: 'location', name: 'Location' },
  { id: 'transport', name: 'Transportation' },
  { id: 'catering', name: 'Catering' },
  { id: 'security', name: 'Security' },
  { id: 'medic', name: 'Medical' },
];

export default function CrewPanel({ page, onUpdate, projectId }: CrewPanelProps) {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(DEFAULT_DEPARTMENTS.map(d => d.id)));
  const [projectMembers, setProjectMembers] = useState<Member[]>([]);
  const [showMemberSelect, setShowMemberSelect] = useState<string | null>(null);

  // Load project members on mount
  useEffect(() => {
    try {
      const members = getMembers(projectId);
      console.log('Loaded project members:', members); // Debug log
      setProjectMembers(members);
    } catch (error) {
      console.error('Error loading project members:', error);
      setProjectMembers([]);
    }
  }, [projectId]);

  // Initialize departments if empty
  useEffect(() => {
    if (page.crewByDept.length === 0) {
      const initialDepts = DEFAULT_DEPARTMENTS.map(dept => ({
        deptId: dept.id,
        deptName: dept.name,
        deptCall: '',
        members: [],
      }));
      onUpdate({ crewByDept: initialDepts });
    } else {
      // Ensure all departments have deptName
      const updatedDepts = page.crewByDept.map(dept => ({
        ...dept,
        deptName: dept.deptName || DEFAULT_DEPARTMENTS.find(d => d.id === dept.deptId)?.name || dept.deptId,
      }));
      if (JSON.stringify(updatedDepts) !== JSON.stringify(page.crewByDept)) {
        onUpdate({ crewByDept: updatedDepts });
      }
    }
  }, [page.crewByDept, onUpdate]);

  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const updateDepartmentCall = (deptIndex: number, newCallTime: string) => {
    const crewByDept = [...page.crewByDept];
    const dept = { ...crewByDept[deptIndex] };
    
    // Update department call time
    dept.deptCall = newCallTime;
    
    // Update all members in this department to have the same call time
    dept.members = dept.members.map(member => ({
      ...member,
      callTime: newCallTime,
    }));
    
    crewByDept[deptIndex] = dept;
    onUpdate({ crewByDept });
  };

  const addCrewMember = (deptIndex: number, fromContact?: Member) => {
    const crewByDept = [...page.crewByDept];
    const members = [...crewByDept[deptIndex].members];
    
    if (fromContact) {
      // Add from project contact
      members.push({
        contactId: fromContact.id,
        name: fromContact.name,
        position: fromContact.title || fromContact.department || '',
        callTime: crewByDept[deptIndex].deptCall || '',
        note: '',
      });
    } else {
      // Add empty member for manual entry
      members.push({
        name: '',
        position: '',
        callTime: crewByDept[deptIndex].deptCall || '',
        note: '',
      });
    }
    
    crewByDept[deptIndex] = { ...crewByDept[deptIndex], members };
    onUpdate({ crewByDept });
    setShowMemberSelect(null);
  };

  const removeCrewMember = (deptIndex: number, memberIndex: number) => {
    const crewByDept = [...page.crewByDept];
    const members = [...crewByDept[deptIndex].members];
    members.splice(memberIndex, 1);
    crewByDept[deptIndex] = { ...crewByDept[deptIndex], members };
    onUpdate({ crewByDept });
  };

  const updateCrewMember = (deptIndex: number, memberIndex: number, field: string, value: any) => {
    const crewByDept = [...page.crewByDept];
    const members = [...crewByDept[deptIndex].members];
    members[memberIndex] = { ...members[memberIndex], [field]: value };
    crewByDept[deptIndex] = { ...crewByDept[deptIndex], members };
    onUpdate({ crewByDept });
    
    // Check if all members have the same call time to update dept call
    const allCallTimes = members.map(m => m.callTime).filter(Boolean);
    const uniqueCallTimes = [...new Set(allCallTimes)];
    if (uniqueCallTimes.length === 1 && allCallTimes.length === members.length) {
      crewByDept[deptIndex].deptCall = uniqueCallTimes[0];
      onUpdate({ crewByDept });
    }
  };

  const addAllMembers = () => {
    const crewByDept = [...page.crewByDept];
    
    console.log('Adding all members. Total contacts:', projectMembers.length); // Debug
    
    // Add all members to production department for now, then we can move them
    const productionDeptIndex = crewByDept.findIndex(dept => dept.deptId === 'production');
    
    if (productionDeptIndex !== -1) {
      projectMembers.forEach(member => {
        // Check if member already exists anywhere
        const alreadyExists = crewByDept.some(dept => 
          dept.members.some(m => m.contactId === member.id)
        );
        
        if (!alreadyExists) {
          console.log('Adding member:', member.name, member.department); // Debug
          crewByDept[productionDeptIndex].members.push({
            contactId: member.id,
            name: member.name,
            position: member.title || member.department || 'Team Member',
            callTime: crewByDept[productionDeptIndex].deptCall || '',
            note: member.department ? `From ${member.department}` : '',
          });
        }
      });
    }
    
    console.log('Updated crew departments:', crewByDept); // Debug
    onUpdate({ crewByDept });
  };

  const getDepartmentMembers = (deptId: string, deptName: string) => {
    console.log(`Getting members for dept: ${deptId} (${deptName})`); // Debug
    console.log('All project members:', projectMembers); // Debug
    
    // Return all members for now to test - we'll filter later
    const filtered = projectMembers.filter(member => {
      // For debugging, let's see all members
      console.log(`Member: ${member.name}, Department: ${member.department}, Title: ${member.title}`);
      
      // If no department specified, add to production
      if (!member.department && !member.title) {
        return deptId === 'production';
      }
      
      // Simple keyword matching for now
      const memberInfo = `${member.department || ''} ${member.title || ''}`.toLowerCase();
      const searchTerms = [
        deptId,
        deptName.toLowerCase(),
        ...deptName.toLowerCase().split('/'),
        ...deptName.toLowerCase().split('&'),
      ];
      
      // Check if any search term matches
      return searchTerms.some(term => 
        memberInfo.includes(term) || 
        term.includes(memberInfo.split(' ')[0]) ||
        // Special cases
        (deptId === 'camera' && (memberInfo.includes('dop') || memberInfo.includes('cinematograph'))) ||
        (deptId === 'sound' && memberInfo.includes('audio')) ||
        (deptId === 'makeup' && (memberInfo.includes('hair') || memberInfo.includes('mu'))) ||
        (deptId === 'wardrobe' && (memberInfo.includes('costume') || memberInfo.includes('styling'))) ||
        (deptId === 'script' && (memberInfo.includes('continuity') || memberInfo.includes('supervisor')))
      );
    });
    
    console.log(`Found ${filtered.length} members for ${deptName}:`, filtered.map(m => m.name)); // Debug
    return filtered;
  };

  const isDeptCallActive = (dept: any) => {
    if (dept.members.length === 0) return true;
    const callTimes = dept.members.map((m: any) => m.callTime).filter(Boolean);
    const uniqueTimes = [...new Set(callTimes)];
    return uniqueTimes.length <= 1 && callTimes.length === dept.members.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="callsheet-section-title">
          <Users className="w-5 h-5" />
          Crew by Department
        </h3>
        <button
          onClick={addAllMembers}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add All Members
        </button>
      </div>

      <div className="space-y-4">
        {page.crewByDept.map((dept, deptIndex) => {
          const isExpanded = expandedDepts.has(dept.deptId);
          const availableMembers = getDepartmentMembers(dept.deptId, dept.deptName);
          const isCallActive = isDeptCallActive(dept);
          
          return (
            <div key={dept.deptId} className="dept-section">
              {/* Department Header */}
              <div className="dept-header">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleDepartment(dept.deptId)}
                    className="flex items-center gap-3 font-medium text-left hover:text-[var(--brand)] transition-colors flex-1"
                  >
                    <div className="text-lg">{isExpanded ? '−' : '+'}</div>
                    <span>{dept.deptName}</span>
                    {dept.members.length > 0 && (
                      <span className="text-sm text-[var(--text-muted)]">
                        ({dept.members.length} member{dept.members.length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      <label className="text-sm text-[var(--text-muted)]">Dept Call:</label>
                      <div className="w-32">
                        <TimePicker
                          value={dept.deptCall || ''}
                          onChange={(time) => updateDepartmentCall(deptIndex, time)}
                          placeholder="Set time"
                          disabled={!isCallActive}
                        />
                      </div>
                      {!isCallActive && (
                        <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
                          Mixed times
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Content */}
              {isExpanded && (
                <div className="dept-content">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Crew Members</h5>
                    <div className="relative">
                      <button
                        onClick={() => setShowMemberSelect(showMemberSelect === dept.deptId ? null : dept.deptId)}
                        className="btn btn-secondary btn-sm flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add Member
                      </button>
                      
                      {showMemberSelect === dept.deptId && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                          <div className="p-4">
                            <div className="text-sm font-medium mb-3">Add from Project Contacts</div>
                            {availableMembers.length > 0 ? (
                              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                                {availableMembers.map(member => {
                                  const isAlreadyAdded = dept.members.some(m => m.contactId === member.id);
                                  return (
                                    <button
                                      key={member.id}
                                      onClick={() => !isAlreadyAdded && addCrewMember(deptIndex, member)}
                                      disabled={isAlreadyAdded}
                                      className={`w-full text-left p-3 text-sm rounded border transition-colors ${
                                        isAlreadyAdded
                                          ? 'opacity-50 cursor-not-allowed bg-[var(--neutral-700)]/10'
                                          : 'hover:bg-[var(--brand)]/10 hover:border-[var(--brand)] border-[var(--border)]'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium">{member.name}</div>
                                          <div className="text-xs text-[var(--text-muted)] mt-1">
                                            {member.department && <span>{member.department}</span>}
                                            {member.title && <span> • {member.title}</span>}
                                            {member.email && <span> • {member.email}</span>}
                                          </div>
                                        </div>
                                        {isAlreadyAdded && (
                                          <span className="text-xs text-[var(--brand)] font-medium">Added</span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-[var(--text-muted)] mb-4 p-3 bg-[var(--neutral-700)]/10 rounded">
                                No contacts found for this department.
                                <br />
                                <span className="text-xs">
                                  Total contacts available: {projectMembers.length}
                                  <br />
                                  Try "Add All Members" to see all contacts, or use "Add Manual Entry" below.
                                </span>
                              </div>
                            )}
                            
                            <div className="border-t border-[var(--border)] pt-3">
                              <button
                                onClick={() => addCrewMember(deptIndex)}
                                className="w-full btn btn-secondary btn-sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Manual Entry
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {dept.members.length > 0 ? (
                    <div className="space-y-3">
                      {dept.members.map((member, memberIndex) => (
                        <div key={memberIndex} className="contact-card">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <input
                                type="text"
                                value={member.name || ''}
                                onChange={(e) => updateCrewMember(deptIndex, memberIndex, 'name', e.target.value)}
                                placeholder="Full name"
                                className="input w-full"
                                disabled={!!member.contactId}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Position</label>
                              <input
                                type="text"
                                value={member.position || ''}
                                onChange={(e) => updateCrewMember(deptIndex, memberIndex, 'position', e.target.value)}
                                placeholder="Job title"
                                className="input w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Call Time</label>
                              <TimePicker
                                value={member.callTime || ''}
                                onChange={(time) => updateCrewMember(deptIndex, memberIndex, 'callTime', time)}
                                placeholder="Set time"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Note</label>
                                <input
                                  type="text"
                                  value={member.note || ''}
                                  onChange={(e) => updateCrewMember(deptIndex, memberIndex, 'note', e.target.value)}
                                  placeholder="Special note"
                                  className="input w-full"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  onClick={() => removeCrewMember(deptIndex, memberIndex)}
                                  className="btn btn-ghost text-red-500 p-2"
                                  title="Remove member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          {member.contactId && (
                            <div className="mt-2 text-xs text-[var(--brand)] flex items-center gap-1">
                              <span className="w-2 h-2 bg-[var(--brand)] rounded-full"></span>
                              From project contacts
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm mb-2">No crew members in {dept.deptName} yet</p>
                      {availableMembers.length > 0 && (
                        <p className="text-xs mb-3">
                          {availableMembers.length} contact{availableMembers.length !== 1 ? 's' : ''} available from this department
                        </p>
                      )}
                      <button
                        onClick={() => setShowMemberSelect(dept.deptId)}
                        className="btn btn-secondary btn-sm"
                      >
                        Add First Member
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-lg">
        <h4 className="font-medium text-[var(--brand)] mb-2">Smart Crew Management</h4>
        <div className="text-sm text-[var(--text-muted)] space-y-1">
          <p>• Set department call time to apply to all members instantly</p>
          <p>• Individual time changes disable department sync (shown as "Mixed times")</p>
          <p>• "Add All Members" imports all contacts from your project</p>
          <p>• Contacts are automatically matched to departments</p>
        </div>
      </div>
    </div>
  );
}