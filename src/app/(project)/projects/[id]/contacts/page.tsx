'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ContactsHeader from '@/features/project/components/contacts/ContactsHeader';
import InvitePeopleModal from '@/features/project/components/contacts/InvitePeopleModal';
import MembersTable from '@/features/project/components/contacts/MembersTable';
import PendingInvites from '@/features/project/components/contacts/PendingInvites';
import { 
  getMembers, 
  inviteMembers, 
  updateMemberRole, 
  removeMember,
  transferOwnership,
  listPendingInvites,
  cancelInvite,
  resendInvite
} from '@/lib/projects-local';
import { Member, Role, PendingInvite } from '@/features/project/types';
import { Users } from 'lucide-react';

export default function ContactsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = () => {
    setLoading(true);
    const projectMembers = getMembers(projectId);
    const invites = listPendingInvites(projectId);
    setMembers(projectMembers);
    setPendingInvites(invites);
    setLoading(false);
  };

  const handleInvite = (emails: string[], role: Role) => {
    inviteMembers(projectId, emails, role);
    loadData();
    setInviteModalOpen(false);
  };

  const handleRoleChange = (memberId: string, role: Role) => {
    updateMemberRole(projectId, memberId, role);
    loadData();
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeMember(projectId, memberId);
      loadData();
    }
  };

  const handleTransferOwnership = (memberId: string) => {
    if (confirm('Are you sure you want to transfer ownership? You will become an Editor.')) {
      transferOwnership(projectId, memberId);
      loadData();
    }
  };

  const handleCancelInvite = (email: string) => {
    cancelInvite(projectId, email);
    loadData();
  };

  const handleResendInvite = (email: string) => {
    resendInvite(projectId, email);
    loadData();
  };

  // Count members by role
  const roleCounts = {
    owner: members.filter(m => m.role === 'owner').length,
    editor: members.filter(m => m.role === 'editor').length,
    viewer: members.filter(m => m.role === 'viewer').length,
    guest: members.filter(m => m.role === 'guest').length,
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <ContactsHeader 
        onInviteClick={() => setInviteModalOpen(true)}
        pendingCount={pendingInvites.length}
      />

      {/* Role Counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-2xl font-bold text-tabular">{roleCounts.owner}</p>
          <p className="text-sm text-[var(--text-muted)]">Owner</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-tabular">{roleCounts.editor}</p>
          <p className="text-sm text-[var(--text-muted)]">Editors</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-tabular">{roleCounts.viewer}</p>
          <p className="text-sm text-[var(--text-muted)]">Viewers</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-tabular">{roleCounts.guest}</p>
          <p className="text-sm text-[var(--text-muted)]">Guests</p>
        </div>
        {pendingInvites.length > 0 && (
          <div className="card p-4 border-[var(--accent)]">
            <p className="text-2xl font-bold text-tabular text-[var(--accent)]">{pendingInvites.length}</p>
            <p className="text-sm text-[var(--text-muted)]">Pending</p>
          </div>
        )}
      </div>

      {/* Members List */}
      {members.length > 0 ? (
        <MembersTable
          members={members}
          onRoleChange={handleRoleChange}
          onRemove={handleRemoveMember}
          onTransferOwnership={handleTransferOwnership}
          currentUserId="current-user" // Mock current user
        />
      ) : (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
          <p className="text-[var(--text-muted)] mb-4">
            Invite people to collaborate on this project
          </p>
          <button
            onClick={() => setInviteModalOpen(true)}
            className="btn btn-primary"
          >
            Invite People
          </button>
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <PendingInvites
          invites={pendingInvites}
          onCancel={handleCancelInvite}
          onResend={handleResendInvite}
        />
      )}

      {/* Invite Modal */}
      {inviteModalOpen && (
        <InvitePeopleModal
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
}