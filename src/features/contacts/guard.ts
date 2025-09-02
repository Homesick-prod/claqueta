import { Contact, ProjectRole } from './model';

/**
 * Validates that owner invariants are maintained
 */
export function validateOwnerConstraints(contacts: Contact[]): {
  isValid: boolean;
  error?: string;
} {
  const owners = contacts.filter(c => c.role === 'OWNER');
  
  if (owners.length < 1) {
    return {
      isValid: false,
      error: 'At least one owner is required'
    };
  }
  
  const primaryOwners = contacts.filter(c => c.isPrimaryOwner);
  if (primaryOwners.length > 1) {
    return {
      isValid: false,
      error: 'Only one primary owner is allowed'
    };
  }
  
  return { isValid: true };
}

/**
 * Checks if a contact can be deleted without violating constraints
 */
export function canDeleteContact(contactId: string, contacts: Contact[]): {
  canDelete: boolean;
  reason?: string;
} {
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) {
    return { canDelete: false, reason: 'Contact not found' };
  }
  
  if (contact.isPrimaryOwner) {
    return { canDelete: false, reason: 'Cannot delete primary owner' };
  }
  
  const owners = contacts.filter(c => c.role === 'OWNER');
  if (contact.role === 'OWNER' && owners.length <= 1) {
    return { canDelete: false, reason: 'Cannot delete the last owner' };
  }
  
  return { canDelete: true };
}

/**
 * Checks if a contact's role can be changed
 */
export function canChangeRole(contactId: string, newRole: ProjectRole, contacts: Contact[]): {
  canChange: boolean;
  reason?: string;
} {
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) {
    return { canChange: false, reason: 'Contact not found' };
  }
  
  if (contact.isPrimaryOwner && newRole !== 'OWNER') {
    return { canChange: false, reason: 'Cannot demote primary owner' };
  }
  
  // Check if demoting from owner would leave no owners
  if (contact.role === 'OWNER' && newRole !== 'OWNER') {
    const owners = contacts.filter(c => c.role === 'OWNER');
    if (owners.length <= 1) {
      return { canChange: false, reason: 'Cannot demote the last owner' };
    }
  }
  
  return { canChange: true };
}

/**
 * Validates email uniqueness within the project
 */
export function isEmailUnique(email: string, contactId: string | null, contacts: Contact[]): boolean {
  return !contacts.some(c => 
    c.email.toLowerCase() === email.toLowerCase() && 
    c.id !== contactId
  );
}