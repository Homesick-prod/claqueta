export type Department = { 
  id: string; 
  name: string;
  order: number; // Required for stable cross-feature sorting
};

export type PositionRef = {
  id: string;           // slug (kebab-case), e.g., "dop", "1st-ad"
  name: string;         // display name
  departmentId: string; // Department.id
};

export type Role = 'OWNER' | 'EDITOR' | 'VIEWER';

export type Contact = {
  id: string;
  name: string;         // Full name in one field
  email?: string;
  phone?: string;
  role: Role;           // App-level permission
  positions: PositionRef[];   // Can span multiple departments
  isPrimaryOwner?: boolean;   // The initial project owner (must not be removable/demotable)
};

// Types needed by existing UI components (backward compatibility)
export type ProjectRole = Role;

export type FeatureKey =
  | 'script' | 'breakdown' | 'moodboard' | 'storyboard'
  | 'floorplan' | 'shotlist' | 'stripboard' | 'calendar'
  | 'contacts' | 'tasks' | 'budget' | 'notes'
  | 'callsheet' | 'assets' | 'integrations';

export type FeaturePolicy = {
  feature: FeatureKey;
  mode: 'ALL_EDITORS' | 'RESTRICTED';
  allowPositions?: string[]; // PositionRef.id
  allowUserIds?: string[];   // Contact.id
};

export type ProjectAccessConfig = {
  projectId: string;
  policies: FeaturePolicy[];
};

export type ProjectDirectory = {
  projectId: string;
  departments: Department[];
  positions: PositionRef[];
  contacts: Contact[];
  access?: ProjectAccessConfig;   // Optional for backward compatibility
};

// Extended types for UI components that expect these
export interface Member extends Contact {
  department?: string;
  title?: string;
  access?: string[];
  lastActiveAt?: string;
  invited?: boolean;
  avatarUrl?: string;
  notes?: string;
}

export interface PendingInvite {
  email: string;
  role: Role;
  invitedAt: string;
  projectId: string;
}