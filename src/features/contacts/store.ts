import { nanoid } from 'nanoid';
import { ProjectDirectory, Contact, Role } from './model';
import { DEFAULT_DEPARTMENTS, DEFAULT_POSITIONS } from './seed';

const STORAGE_PREFIX = 'claqueta:directory:';

/**
 * Load directory data from localStorage (SSR-safe)
 */
export function loadDirectory(projectId: string): ProjectDirectory | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);
    
    // Ensure all required fields exist
    return {
      projectId,
      departments: data.departments || [],
      positions: data.positions || [],
      contacts: data.contacts || [],
      access: data.access || { projectId, policies: [] }
    };
  } catch (error) {
    console.warn('Failed to load directory data:', error);
    return null;
  }
}

/**
 * Save directory data to localStorage (no-op on server)
 */
export function saveDirectory(dir: ProjectDirectory): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = `${STORAGE_PREFIX}${dir.projectId}`;
    localStorage.setItem(key, JSON.stringify(dir));
  } catch (error) {
    console.warn('Failed to save directory data:', error);
  }
}

/**
 * Ensure directory is bootstrapped with defaults if missing
 * Merges new seed data without removing existing custom entries
 */
export function ensureBootstrapped(projectId: string): ProjectDirectory {
  if (typeof window === 'undefined') {
    return {
      projectId,
      departments: [],
      positions: [],
      contacts: [],
      access: { projectId, policies: [] }
    };
  }

  let dir = loadDirectory(projectId);
  
  if (!dir) {
    // Create new directory with all defaults
    dir = {
      projectId,
      departments: [...DEFAULT_DEPARTMENTS],
      positions: [...DEFAULT_POSITIONS],
      contacts: [],
      access: { projectId, policies: [] }
    };
  } else {
    // Migration: Ensure access field exists
    if (!dir.access) {
      dir.access = { projectId, policies: [] };
    }
    
    // Migration: Add missing departments from seed
    DEFAULT_DEPARTMENTS.forEach(seedDept => {
      if (!dir!.departments.some(existingDept => existingDept.id === seedDept.id)) {
        dir!.departments.push({ ...seedDept });
      }
    });
    
    // Migration: Add missing positions from seed
    DEFAULT_POSITIONS.forEach(seedPos => {
      if (!dir!.positions.some(existingPos => existingPos.id === seedPos.id)) {
        dir!.positions.push({ ...seedPos });
      }
    });
    
    // Migration: Ensure all departments have numeric order field
    dir.departments = dir.departments.map((dept, index) => {
      // If department has a valid order, keep it
      if (typeof dept.order === 'number') {
        return dept;
      }
      
      // Otherwise, try to find the order from DEFAULT_DEPARTMENTS
      const seedDept = DEFAULT_DEPARTMENTS.find(d => d.id === dept.id);
      if (seedDept) {
        return { ...dept, order: seedDept.order };
      }
      
      // Fallback: use index + 1000 to put custom departments at the end
      return { ...dept, order: 1000 + index };
    });
    
    // Sort departments by order for consistent display
    dir.departments.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }
  
  // Bootstrap primary owner if no contacts exist
  if (dir.contacts.length === 0) {
    const primaryOwner: Contact = {
      id: nanoid(),
      name: 'Project Owner',
      email: 'owner@example.com',
      role: 'OWNER',
      positions: [],
      isPrimaryOwner: true
    };
    
    // Try to get saved owner info from user preferences
    try {
      const storedMe = localStorage.getItem('claqueta:me');
      if (storedMe) {
        const parsed = JSON.parse(storedMe);
        if (parsed.name) primaryOwner.name = parsed.name;
        if (parsed.email) primaryOwner.email = parsed.email;
      }
    } catch {
      // Use defaults if parse fails
    }
    
    dir.contacts = [primaryOwner];
  } else {
    // Migration: Ensure at least one contact is marked as primary owner
    const hasPrimaryOwner = dir.contacts.some(c => c.isPrimaryOwner);
    if (!hasPrimaryOwner) {
      // Find first owner or first contact
      const firstOwner = dir.contacts.find(c => c.role === 'OWNER');
      if (firstOwner) {
        firstOwner.isPrimaryOwner = true;
      } else if (dir.contacts.length > 0) {
        // No owners at all? Make first contact an owner and primary
        dir.contacts[0].role = 'OWNER';
        dir.contacts[0].isPrimaryOwner = true;
      }
    }
  }
  
  // Save the bootstrapped/migrated directory
  saveDirectory(dir);
  
  return dir;
}