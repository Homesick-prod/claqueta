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
    // Create new directory with defaults
    dir = {
      projectId,
      departments: [...DEFAULT_DEPARTMENTS],
      positions: [...DEFAULT_POSITIONS],
      contacts: [],
      access: { projectId, policies: [] }
    };
  } else {
    // Ensure access exists
    if (!dir.access) {
      dir.access = { projectId, policies: [] };
    }
    
    // Add missing departments
    DEFAULT_DEPARTMENTS.forEach(d => {
      if (!dir!.departments.some(x => x.id === d.id)) {
        dir!.departments.push(d);
      }
    });
    
    // Add missing positions
    DEFAULT_POSITIONS.forEach(p => {
      if (!dir!.positions.some(x => x.id === p.id)) {
        dir!.positions.push(p);
      }
    });
    
    // Ensure all departments have numeric order
    dir.departments = dir.departments.map((d, i) => ({
      ...d,
      order: typeof d.order === 'number' ? d.order : i
    }));
    
    // Sort departments by order
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
    
    // Try to get saved owner info
    try {
      const storedMe = localStorage.getItem('claqueta:me');
      if (storedMe) {
        const parsed = JSON.parse(storedMe);
        if (parsed.name) primaryOwner.name = parsed.name;
        if (parsed.email) primaryOwner.email = parsed.email;
      }
    } catch {
      // Use defaults
    }
    
    dir.contacts = [primaryOwner];
  }
  
  // Save bootstrapped directory
  saveDirectory(dir);
  
  return dir;
}