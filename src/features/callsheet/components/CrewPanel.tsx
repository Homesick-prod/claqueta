'use client';

import { Users, Plus, Trash2, UserPlus, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CallSheetPage } from '../model';
import { getMembers } from '@/lib/projects-local';
import { Member } from '@/features/project/types';

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
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['direction', 'camera']));
  const [projectMembers, setProjectMembers] = useState<Member[]>([]);
  const [showMemberSelect, setShowMemberSelect] = useState<string | null>(null);

  // Load project members on mount
  useEffect(() => {
    const members = getMembers(projectId);
    setProjectMembers(members);
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
    
    // Group project members by department
    const membersByDept: { [key: string]: Member[] } = {};
    projectMembers.forEach(member => {
      if (member.department) {
        const deptId = member.department.toLowerCase().replace(/[^a-z]/g, '');
        if (!membersByDept[deptId]) membersByDept[deptId] = [];
        membersByDept[deptId].push(member);
      } else {
        // Add to production if no specific department
        if (!membersByDept['production']) membersByDept['production'] = [];
        membersByDept['production'].push(member);
      }
    });
    
    // Add members to matching departments
    crewByDept.forEach((dept, deptIndex) => {
      const deptMembers = membersByDept[dept.deptId] || [];
      deptMembers.forEach(member => {
        // Check if member already exists
        const exists = dept.members.some(m => m.contactId === member.id);
        if (!exists) {
          dept.members.push({
            contactId: member.id,
            name: member.name,
            position: member.title || member.department || '',
            callTime: dept.deptCall || '',
            note: '',
          });
        }
      });
    });
    
    onUpdate({ crewByDept });
  };

  const getDepartmentMembers = (deptId: string) => {
    return projectMembers.filter(member => {
      if (!member.department) return deptId === 'production';
      const memberDeptId = member.department.toLowerCase().replace(/[^a-z]/g, '');
      return memberDeptId === deptId;
    });
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
          const availableMembers = getDepartmentMembers(dept.deptId);
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
                      <div className="w-24">
                        <input
                          type="time"
                          value={dept.deptCall || ''}
                          onChange={(e) => updateDepartmentCall(deptIndex, e.target.value)}
                          disabled={!isCallActive}
                          className="input"
                        />
                      </div>
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
                        <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                          <div className="p-3">
                            <div className="text-sm font-medium mb-2">Add from Contacts</div>
                            {availableMembers.length > 0 ? (
                              <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
                                {availableMembers.map(member => (
                                  <button
                                    key={member.id}
                                    onClick={() => addCrewMember(deptIndex, member)}
                                    className="w-full text-left p-2 text-sm hover:bg-[var(--neutral-700)]/20 rounded"
                                  >
                                    <div className="font-medium">{member.name}</div>
                                    {member.title && (
                                      <div className="text-xs text-[var(--text-muted)]">{member.title}</div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-[var(--text-muted)] mb-3">
                                No contacts in this department
                              </div>
                            )}
                            <button
                              onClick={() => addCrewMember(deptIndex)}
                              className="w-full btn btn-secondary btn-sm"
                            >
                              Add Manual Entry
                            </button>
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
                              <input
                                type="time"
                                value={member.callTime || ''}
                                onChange={(e) => updateCrewMember(deptIndex, memberIndex, 'callTime', e.target.value)}
                                className="input w-full"
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
                            <div className="mt-2 text-xs text-[var(--brand)]">
                              ✓ From project contacts
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No crew members in this department yet</p>
                      <button
                        onClick={() => setShowMemberSelect(dept.deptId)}
                        className="btn btn-secondary btn-sm mt-2"
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
        <h4 className="font-medium text-[var(--brand)] mb-2">Smart Call Time Sync</h4>
        <div className="text-sm text-[var(--text-muted)] space-y-1">
          <p>• Set department call time to apply to all members</p>
          <p>• Individual changes disable department sync until times match</p>
          <p>• Use "Add All Members" to quickly import from your project contacts</p>
        </div>
      </div>
    </div>
  );
}