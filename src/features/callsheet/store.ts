import { nanoid } from 'nanoid';
import { CallSheetDoc, CallSheetPage } from './model';

const STORAGE_KEY_PREFIX = 'claqueta:callsheet:';

export function loadDoc(projectId: string): CallSheetDoc {
  const key = STORAGE_KEY_PREFIX + projectId;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading call sheet doc:', error);
  }
  
  // Create default document with one page
  const now = new Date().toISOString();
  const pageId = nanoid();
  
  const defaultPage: CallSheetPage = {
    id: pageId,
    title: 'Page 1',
    castCalls: [],
    crewByDept: [],
    distributionContactIds: [],
    createdAt: now,
    updatedAt: now,
  };
  
  const doc: CallSheetDoc = {
    projectId,
    pages: [defaultPage],
    activePageId: pageId,
  };
  
  saveDoc(doc);
  return doc;
}

export function saveDoc(doc: CallSheetDoc): void {
  const key = STORAGE_KEY_PREFIX + doc.projectId;
  
  try {
    localStorage.setItem(key, JSON.stringify(doc));
  } catch (error) {
    console.error('Error saving call sheet doc:', error);
  }
}