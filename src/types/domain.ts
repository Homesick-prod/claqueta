export type Phase = 'pre' | 'prod' | 'wrap';

export interface Project {
  id: string;
  name: string;
  active: boolean;
  archived?: boolean;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
  counters?: {
    shots?: number;
    strips?: number;
  };
  phase?: Phase;
}

export const ALLOWED_SLOTS = 5;