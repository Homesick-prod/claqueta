import { Contact, ProjectRole, ProjectDirectory } from './model';

/**
 * Adapter used by UI tables/drawers
 * UI calls with signature: (contactId, contacts)
 */
export function canDeleteContact(contactId: string, contacts: Contact[]) {
  const c = contacts.find(x => x.id === contactId);
  if (!c) return { canDelete: true as const };

  if (c.isPrimaryOwner) {
    return { canDelete: false as const, reason: 'Cannot remove the primary owner.' };
  }
  if (c.role === 'OWNER') {
    const ownerCount = contacts.filter(x => x.role === 'OWNER').length;
    if (ownerCount <= 1) {
      return { canDelete: false as const, reason: 'Cannot remove the last owner.' };
    }
  }
  return { canDelete: true as const };
}

/**
 * Adapter used by UI for role changes
 * UI calls with signature: (contactId, newRole, contacts)
 */
export function canChangeRole(contactId: string, newRole: ProjectRole, contacts: Contact[]) {
  const c = contacts.find(x => x.id === contactId);
  if (!c) return { canChange: true as const };

  if (c.isPrimaryOwner && newRole !== 'OWNER') {
    return { canChange: false as const, reason: 'Primary owner cannot be demoted.' };
  }
  if (c.role === 'OWNER' && newRole !== 'OWNER') {
    const ownerCount = contacts.filter(x => x.role === 'OWNER').length;
    if (ownerCount <= 1) {
      return { canChange: false as const, reason: 'Cannot demote the last owner.' };
    }
  }
  return { canChange: true as const };
}

/**
 * UI calls with signature: (email, excludeId, contacts)
 */
export function isEmailUnique(email: string, excludeContactId: string | undefined, contacts: Contact[]) {
  if (!email) return true;
  const normalized = email.toLowerCase().trim();
  return !contacts.some(c => c.id !== excludeContactId && (c.email || '').toLowerCase().trim() === normalized);
}

/**
 * Keep the dir-based helpers for hooks that already use them
 */
export function isEmailUniqueInDir(dir: ProjectDirectory, email: string, excludeContactId?: string) {
  return isEmailUnique(email, excludeContactId, dir.contacts);
}

export function canRemoveContact(dir: ProjectDirectory, contactId: string) {
  return canDeleteContact(contactId, dir.contacts).canDelete;
}

export function canDemoteOwner(dir: ProjectDirectory, contactId: string) {
  const c = dir.contacts.find(x => x.id === contactId);
  if (!c) return true;
  if (c.isPrimaryOwner) return false;
  if (c.role === 'OWNER') {
    const owners = dir.contacts.filter(x => x.role === 'OWNER').length;
    return owners > 1;
  }
  return true;
}