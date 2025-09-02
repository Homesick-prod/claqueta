import { ProjectDirectory } from './model';

const STORAGE_PREFIX = 'claqueta:directory:';

/**
 * Load directory data from localStorage, returns valid structure with empty arrays if not found
 */
export function loadDirectory(projectId: string): ProjectDirectory {
  if (typeof window === 'undefined') {
    return getEmptyDirectory(projectId);
  }

  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return getEmptyDirectory(projectId);
    }

    const data = JSON.parse(stored);
    
    // Ensure all required fields exist
    return {
      projectId,
      departments: data.departments || [],
      positions: data.positions || [],
      contacts: data.contacts || [],
      access: data.access || {
        projectId,
        policies: []
      }
    };
  } catch (error) {
    console.warn('Failed to load directory data:', error);
    return getEmptyDirectory(projectId);
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
 * Returns an empty directory structure
 */
function getEmptyDirectory(projectId: string): ProjectDirectory {
  return {
    projectId,
    departments: [],
    positions: [],
    contacts: [],
    access: {
      projectId,
      policies: []
    }
  };
}