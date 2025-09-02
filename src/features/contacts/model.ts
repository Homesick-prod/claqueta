export type ProjectRole = 'OWNER' | 'EDITOR' | 'VIEWER' | 'GUEST';

export type Department = { 
  id: string; 
  name: string; 
};

export type PositionRef = {
  id: string;           // slug (kebab-case), e.g., "dop", "1st-ad"
  name: string;         // display name
  departmentId: string; // Department.id
};

export type Contact = {
  id: string;
  name: string;         // single field: "First Last"
  email: string;
  phone?: string;
  positions: PositionRef[];
  role: ProjectRole;
  isPrimaryOwner?: boolean; // true for the seeded first row; cannot delete or demote; cannot transfer
  notes?: string;
  lastActive?: string;  // ISO
};

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
  access: ProjectAccessConfig;
};