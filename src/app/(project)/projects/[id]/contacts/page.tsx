'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { Contact, ProjectRole, FeatureKey, FeaturePolicy } from '@/features/contacts/model';
import { useDirectory } from '@/features/contacts/useDirectory';
import ContactsHeader from '@/features/contacts/components/ContactsHeader';
import MembersTable from '@/features/contacts/components/MembersTable';
import FeatureAccessPanel from '@/features/contacts/components/FeatureAccessPanel';
import FeatureAccessModal from '@/features/contacts/components/FeatureAccessModal';
import PositionPickerModal from '@/features/contacts/components/PositionPickerModal';
import InviteModal from '@/features/contacts/components/InviteModal';
import ContactDrawer from '@/features/contacts/components/ContactDrawer';

interface ContactsPageProps {
  params: Promise<{ id: string }>;
}

export default function ContactsPage({ params }: ContactsPageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  // Directory hook
  const { dir, isLoading, addBlankContact, updateContact, removeContact, setFeaturePolicy } = useDirectory(projectId);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<ProjectRole | 'ALL'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [highlightContactId, setHighlightContactId] = useState<string | null>(null);

  // Modal states
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [selectedContactForPositions, setSelectedContactForPositions] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedContactForInvite, setSelectedContactForInvite] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContactForDrawer, setSelectedContactForDrawer] = useState<string | null>(null);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [selectedFeatureForModal, setSelectedFeatureForModal] = useState<FeatureKey | null>(null);

  // Clear highlight after some time
  useEffect(() => {
    if (highlightContactId) {
      const timer = setTimeout(() => setHighlightContactId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightContactId]);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return dir.contacts.filter(contact => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = contact.name.toLowerCase().includes(query);
        const matchesEmail = contact.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Role filter
      if (roleFilter !== 'ALL' && contact.role !== roleFilter) {
        return false;
      }

      // Department filter
      if (departmentFilter) {
        const hasMatchingPosition = contact.positions.some(pos => pos.departmentId === departmentFilter);
        if (!hasMatchingPosition) return false;
      }

      return true;
    });
  }, [dir.contacts, searchQuery, roleFilter, departmentFilter]);

  // Handle add contact
  const handleAddContact = () => {
    // Clear filters to show new contact
    setSearchQuery('');
    setRoleFilter('ALL');
    setDepartmentFilter('');

    // Create blank contact
    const newContact = addBlankContact();
    
    // Highlight and open drawer
    setHighlightContactId(newContact.id);
    setSelectedContactForDrawer(newContact.id);
    setDrawerOpen(true);
  };

  // Handle update contact with positions
  const handleUpdateContactPositions = (contactId: string, positions: Contact['positions']) => {
    updateContact(contactId, { positions });
  };

  // Handle open position modal
  const handleOpenPositionModal = (contactId: string) => {
    setSelectedContactForPositions(contactId);
    setPositionModalOpen(true);
  };

  // Handle open invite modal
  const handleOpenInviteModal = (contactId: string) => {
    setSelectedContactForInvite(contactId);
    setInviteModalOpen(true);
  };

  // Handle edit feature policy
  const handleEditFeaturePolicy = (featureKey: FeatureKey) => {
    setSelectedFeatureForModal(featureKey);
    setFeatureModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blueprint bg-vignette-soft p-6 md:p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedContactForPositionsData = selectedContactForPositions 
    ? dir.contacts.find(c => c.id === selectedContactForPositions)
    : null;

  const selectedContactForInviteData = selectedContactForInvite
    ? dir.contacts.find(c => c.id === selectedContactForInvite)
    : null;

  const selectedContactForDrawerData = selectedContactForDrawer
    ? dir.contacts.find(c => c.id === selectedContactForDrawer)
    : null;

  const currentFeaturePolicy = selectedFeatureForModal
    ? dir.access.policies.find(p => p.feature === selectedFeatureForModal)
    : null;

  return (
    <div className="min-h-screen bg-blueprint bg-vignette-soft p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ContactsHeader
          contacts={dir.contacts}
          departments={dir.departments}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          onAddContact={handleAddContact}
        />

        {/* Members Table */}
        <div className="mb-8">
          <MembersTable
            contacts={filteredContacts}
            departments={dir.departments}
            positions={dir.positions}
            onUpdateContact={updateContact}
            onRemoveContact={removeContact}
            onOpenPositionModal={handleOpenPositionModal}
            onOpenInviteModal={handleOpenInviteModal}
            highlightContactId={highlightContactId}
          />
        </div>

        {/* Feature Access Panel */}
        <FeatureAccessPanel
          policies={dir.access.policies}
          contacts={dir.contacts}
          positions={dir.positions}
          onEditPolicy={handleEditFeaturePolicy}
        />

        {/* Position Picker Modal */}
        <PositionPickerModal
          isOpen={positionModalOpen}
          onClose={() => {
            setPositionModalOpen(false);
            setSelectedContactForPositions(null);
          }}
          contact={selectedContactForPositionsData}
          departments={dir.departments}
          positions={dir.positions}
          onSave={handleUpdateContactPositions}
        />

        {/* Invite Modal */}
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={() => {
            setInviteModalOpen(false);
            setSelectedContactForInvite(null);
          }}
          contact={selectedContactForInviteData}
        />

        {/* Feature Access Modal */}
        <FeatureAccessModal
          isOpen={featureModalOpen}
          onClose={() => {
            setFeatureModalOpen(false);
            setSelectedFeatureForModal(null);
          }}
          featureKey={selectedFeatureForModal}
          currentPolicy={currentFeaturePolicy}
          contacts={dir.contacts}
          positions={dir.positions}
          onSave={(policy) => {
            setFeaturePolicy(policy);
            setFeatureModalOpen(false);
            setSelectedFeatureForModal(null);
          }}
        />

        {/* Contact Drawer */}
        <ContactDrawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedContactForDrawer(null);
          }}
          contact={selectedContactForDrawerData}
          contacts={dir.contacts}
          onUpdateContact={updateContact}
          onRemoveContact={removeContact}
        />
      </div>
    </div>
  );
}