'use client';

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { ProjectDirectory, Contact, Role, FeaturePolicy } from './model';
import { loadDirectory, saveDirectory, ensureBootstrapped } from './store';
import { isEmailUniqueInDir, canRemoveContact, canDemoteOwner } from './guard';

export function useDirectory(projectId: string) {
  const [dir, setDir] = useState<ProjectDirectory>(() => ({
    projectId,
    departments: [],
    positions: [],
    contacts: [],
    access: { projectId, policies: [] }
  }));
  
  const [isLoading, setIsLoading] = useState(true);

  // Load directory on mount and ensure bootstrapped
  useEffect(() => {
    if (!projectId) return;
    
    const bootstrappedDir = ensureBootstrapped(projectId);
    setDir(bootstrappedDir);
    setIsLoading(false);
  }, [projectId]);

  // Save directory changes
  const saveChanges = useCallback((newDir: ProjectDirectory) => {
    setDir(newDir);
    saveDirectory(newDir);
  }, []);

  // Add blank contact
  const addBlankContact = useCallback((): Contact => {
    const newContact: Contact = {
      id: nanoid(),
      name: '',
      email: '',
      positions: [],
      role: 'VIEWER'
    };

    const newDir: ProjectDirectory = {
      ...dir,
      contacts: [newContact, ...dir.contacts]
    };

    saveChanges(newDir);
    return newContact;
  }, [dir, saveChanges]);

  // Update contact
  const updateContact = useCallback((id: string, patch: Partial<Contact>) => {
    // Validate email uniqueness if email is being changed
    if (patch.email !== undefined && patch.email !== '') {
      if (!isEmailUniqueInDir(dir, patch.email, id)) {
        // Log warning in dev mode but don't throw error (to not break UI)
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Email ${patch.email} is already in use by another contact`);
        }
        return;
      }
    }
    
    // Validate role change if applicable
    if (patch.role !== undefined) {
      const contact = dir.contacts.find(c => c.id === id);
      if (contact && contact.role === 'OWNER' && patch.role !== 'OWNER') {
        if (!canDemoteOwner(dir, id)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Cannot demote this owner');
          }
          return;
        }
      }
    }

    const newContacts = dir.contacts.map(contact =>
      contact.id === id
        ? { ...contact, ...patch }
        : contact
    );

    const newDir: ProjectDirectory = { ...dir, contacts: newContacts };
    saveChanges(newDir);
  }, [dir, saveChanges]);

  // Remove contact
  const removeContact = useCallback((id: string) => {
    if (!canRemoveContact(dir, id)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot remove this contact');
      }
      return;
    }

    const newContacts = dir.contacts.filter(contact => contact.id !== id);
    const newDir: ProjectDirectory = { ...dir, contacts: newContacts };
    saveChanges(newDir);
  }, [dir, saveChanges]);

  // Set feature policy - properly implemented
  const setFeaturePolicy = useCallback((policy: FeaturePolicy) => {
    const existing = dir.access?.policies ?? [];
    const idx = existing.findIndex(p => p.feature === policy.feature);
    const nextPolicies = [...existing];
    
    if (idx >= 0) {
      nextPolicies[idx] = policy;
    } else {
      nextPolicies.push(policy);
    }

    const newDir: ProjectDirectory = {
      ...dir,
      access: { 
        projectId, 
        policies: nextPolicies 
      }
    };
    
    saveChanges(newDir);
  }, [dir, projectId, saveChanges]);

  // Return interface compatible with existing UI
  return {
    dir,
    isLoading,
    addBlankContact,
    updateContact,
    removeContact,
    setFeaturePolicy
  };
}