'use client';

import { useState } from 'react';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { Contact, ProjectRole, Department } from '../model';

interface ContactsHeaderProps {
  contacts: Contact[];
  departments: Department[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: ProjectRole | 'ALL';
  onRoleFilterChange: (role: ProjectRole | 'ALL') => void;
  departmentFilter: string;
  onDepartmentFilterChange: (departmentId: string) => void;
  onAddContact: () => void;
}

export default function ContactsHeader({
  contacts,
  departments,
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  onAddContact
}: ContactsHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Count roles
  const roleCounts = contacts.reduce((acc, contact) => {
    acc[contact.role] = (acc[contact.role] || 0) + 1;
    return acc;
  }, {} as Record<ProjectRole, number>);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--brand)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Contacts & Roles</h1>
            <p className="text-[var(--text-muted)] text-sm">
              Manage team members and their access levels
            </p>
          </div>
        </div>
        <button
          onClick={onAddContact}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="chip bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20">
          <Users className="w-4 h-4 mr-1" />
          Owners: {roleCounts.OWNER || 0}
        </div>
        <div className="chip bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20">
          Editors: {roleCounts.EDITOR || 0}
        </div>
        <div className="chip bg-blue-500/10 text-blue-500 border-blue-500/20">
          Viewers: {roleCounts.VIEWER || 0}
        </div>
        <div className="chip bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20">
          Guests: {roleCounts.GUEST || 0}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="mt-4 p-4 card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value as ProjectRole | 'ALL')}
                className="input"
              >
                <option value="ALL">All Roles</option>
                <option value="OWNER">Owners</option>
                <option value="EDITOR">Editors</option>
                <option value="VIEWER">Viewers</option>
                <option value="GUEST">Guests</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => onDepartmentFilterChange(e.target.value)}
                className="input"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(roleFilter !== 'ALL' || departmentFilter) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  onRoleFilterChange('ALL');
                  onDepartmentFilterChange('');
                }}
                className="btn btn-ghost text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}