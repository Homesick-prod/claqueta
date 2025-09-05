import { ProjectDirectory } from './model';
import { loadDirectory } from './store';

/**
 * Read directory snapshot for non-React consumers (client-only)
 * Returns null on SSR or if no data exists
 */
export function readDirectorySnapshot(projectId: string): ProjectDirectory | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return loadDirectory(projectId);
}