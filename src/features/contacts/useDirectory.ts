'use client';

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { ProjectDirectory, Contact, FeaturePolicy } from './model';
import { loadDirectory, saveDirectory } from './store';
import { DEFAULT_DEPARTMENTS, DEFAULT_POSITIONS } from './seed';
import { canDeleteContact, validateOwnerConstraints } from './guard';

export function useDirectory(projectId: string) {
  const [dir, setDir] = useState<ProjectDirectory>({
    projectId,
    departments: [],
    positions: [],
    contacts: [],
    access: { projectId, policies: [] }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load directory on mount
  useEffect(() => {
    if (!projectId) return;

    const loadedDir = loadDirectory(projectId);
    
    // Inject defaults if empty
    if (loadedDir.departments.length === 0) {
      loadedDir.departments = [...DEFAULT_DEPARTMENTS];
    }
    
    if (loadedDir.positions.length === 0) {
      loadedDir.positions = [...DEFAULT_POSITIONS];
    }
    
    // Seed primary owner if no contacts
    if (loadedDir.contacts.length === 0) {
      let ownerData = { name: 'You (Owner)', email: 'owner@example.com' };
      
      try {
        const storedMe = localStorage.getItem('claqueta:me');
        if (storedMe) {
          const parsed = JSON.parse(storedMe);
          if (parsed.name) ownerData.name = parsed.name;
          if (parsed.email) ownerData.email = parsed.email;
        }
      } catch {
        // Use defaults
      }
      
      const primaryOwner: Contact = {
        id: nanoid(),
        name: ownerData.name,
        email: ownerData.email,
        positions: [],
        role: 'OWNER',
        isPrimaryOwner: true,
        lastActive: new Date().toISOString()
      };
      
      loadedDir.contacts = [primaryOwner];
    }
    
    setDir(loadedDir);
    saveDirectory(loadedDir);
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
      role: 'VIEWER',
      lastActive: new Date().toISOString()
    };

    const newDir = {
      ...dir,
      contacts: [newContact, ...dir.contacts]
    };

    saveChanges(newDir);
    return newContact;
  }, [dir, saveChanges]);

  // Update contact
  const updateContact = useCallback((id: string, patch: Partial<Contact>) => {
    const newContacts = dir.contacts.map(contact =>
      contact.id === id
        ? { ...contact, ...patch, lastActive: new Date().toISOString() }
        : contact
    );

    // Validate owner constraints if role is being changed
    if (patch.role) {
      const validation = validateOwnerConstraints(newContacts);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
    }

    const newDir = { ...dir, contacts: newContacts };
    saveChanges(newDir);
  }, [dir, saveChanges]);

  // Remove contact
  const removeContact = useCallback((id: string) => {
    const validation = canDeleteContact(id, dir.contacts);
    if (!validation.canDelete) {
      throw new Error(validation.reason);
    }

    const newContacts = dir.contacts.filter(contact => contact.id !== id);
    const newDir = { ...dir, contacts: newContacts };
    saveChanges(newDir);
  }, [dir, saveChanges]);

  // Set feature policy
  const setFeaturePolicy = useCallback((policy: FeaturePolicy) => {
    const existingPolicies = dir.access.policies.filter(p => p.feature !== policy.feature);
    const newPolicies = [...existingPolicies, policy];
    
    const newDir = {
      ...dir,
      access: {
        ...dir.access,
        policies: newPolicies
      }
    };
    
    saveChanges(newDir);
  }, [dir, saveChanges]);

  return {
    dir,
    isLoading,
    addBlankContact,
    updateContact,
    removeContact,
    setFeaturePolicy
  };
}