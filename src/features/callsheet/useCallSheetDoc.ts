'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { CallSheetDoc, CallSheetPage } from './model';
import { loadDoc, saveDoc } from './store';
import { useAutoSave } from '@/hooks/useAutoSave';

export function useCallSheetDoc(projectId: string) {
  const [doc, setDoc] = useState<CallSheetDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Load document on mount
  useEffect(() => {
    if (!projectId) return;
    
    const loadedDoc = loadDoc(projectId);
    setDoc(loadedDoc);
    setLoading(false);
  }, [projectId]);

  // Auto-save hook
  const { isSaving } = useAutoSave(
    doc,
    (docToSave) => {
      if (docToSave) {
        saveDoc(docToSave);
      }
    },
    [doc],
    500
  );

  // Get active page
  const activePage = useMemo(() => {
    if (!doc) return null;
    return doc.pages.find(p => p.id === doc.activePageId) || doc.pages[0] || null;
  }, [doc]);

  // Create new page
  const createPage = useCallback(() => {
    if (!doc) return;

    const pageNumber = doc.pages.length + 1;
    const now = new Date().toISOString();
    const newPageId = nanoid();
    
    const newPage: CallSheetPage = {
      id: newPageId,
      title: `Page ${pageNumber}`,
      castCalls: [],
      crewByDept: [],
      distributionContactIds: [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedDoc: CallSheetDoc = {
      ...doc,
      pages: [...doc.pages, newPage],
      activePageId: newPageId,
    };

    setDoc(updatedDoc);
  }, [doc]);

  // Switch active page
  const switchActivePage = useCallback((pageId: string) => {
    if (!doc) return;
    
    const updatedDoc: CallSheetDoc = {
      ...doc,
      activePageId: pageId,
    };
    
    setDoc(updatedDoc);
  }, [doc]);

  // Rename page
  const renamePage = useCallback((pageId: string, newTitle: string) => {
    if (!doc) return;

    const now = new Date().toISOString();
    const updatedPages = doc.pages.map(page =>
      page.id === pageId
        ? { ...page, title: newTitle, updatedAt: now }
        : page
    );

    const updatedDoc: CallSheetDoc = {
      ...doc,
      pages: updatedPages,
    };

    setDoc(updatedDoc);
  }, [doc]);

  // Duplicate active page
  const duplicateActivePage = useCallback(() => {
    if (!doc || !activePage) return;

    const pageNumber = doc.pages.length + 1;
    const now = new Date().toISOString();
    const newPageId = nanoid();
    
    const duplicatedPage: CallSheetPage = {
      ...structuredClone(activePage),
      id: newPageId,
      title: `Page ${pageNumber}`,
      createdAt: now,
      updatedAt: now,
    };

    const updatedDoc: CallSheetDoc = {
      ...doc,
      pages: [...doc.pages, duplicatedPage],
      activePageId: newPageId,
    };

    setDoc(updatedDoc);
  }, [doc, activePage]);

  // Delete active page
  const deleteActivePage = useCallback(() => {
    if (!doc || doc.pages.length <= 1) return; // Block if only one page

    const remainingPages = doc.pages.filter(p => p.id !== doc.activePageId);
    const newActivePageId = remainingPages[0]?.id || '';

    const updatedDoc: CallSheetDoc = {
      ...doc,
      pages: remainingPages,
      activePageId: newActivePageId,
    };

    setDoc(updatedDoc);
  }, [doc]);

  // Update active page
  const updatePage = useCallback((patch: Partial<CallSheetPage>) => {
    if (!doc || !activePage) return;

    const now = new Date().toISOString();
    const updatedPages = doc.pages.map(page =>
      page.id === activePage.id
        ? { ...page, ...patch, updatedAt: now }
        : page
    );

    const updatedDoc: CallSheetDoc = {
      ...doc,
      pages: updatedPages,
    };

    setDoc(updatedDoc);
  }, [doc, activePage]);

  return {
    doc,
    activePage,
    loading,
    isSaving,
    createPage,
    switchActivePage,
    renamePage,
    duplicateActivePage,
    deleteActivePage,
    updatePage,
  };
}