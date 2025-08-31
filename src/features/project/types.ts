// Re-export domain types
export * from './types/domain';

// Member and role types
export type Role = 'owner' | 'editor' | 'viewer' | 'guest';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  department?: string;
  title?: string;
  access?: string[];
  lastActiveAt?: string;
  invited?: boolean;
}

export interface PendingInvite {
  email: string;
  role: Role;
  invitedAt: string;
  projectId: string;
}