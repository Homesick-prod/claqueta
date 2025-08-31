import { Project, Phase, Member, Role, PendingInvite } from '../types';

const STORAGE_KEY = 'filmProductionProjects';
const MEMBERS_KEY = 'filmProductionMembers';
const INVITES_KEY = 'filmProductionInvites';

// Project functions (existing)
export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project[] {
  const projects = getProjects();
  const newProject: Project = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updated = [newProject, ...projects];
  saveProjects(updated);
  
  // Create default owner member
  const owner: Member = {
    id: 'current-user',
    name: 'Project Owner',
    email: 'owner@example.com',
    role: 'owner',
    lastActiveAt: new Date().toISOString(),
  };
  setMembers(newProject.id, [owner]);
  
  return updated;
}

export function updateProject(id: string, updates: Partial<Project>): Project[] {
  const projects = getProjects();
  const updated = projects.map(p =>
    p.id === id
      ? { ...p, ...updates, updatedAt: new Date().toISOString() }
      : p
  );
  saveProjects(updated);
  return updated;
}

export function deleteProject(id: string): Project[] {
  const projects = getProjects();
  const updated = projects.filter(p => p.id !== id);
  saveProjects(updated);
  
  // Clean up members and invites
  localStorage.removeItem(`${MEMBERS_KEY}_${id}`);
  localStorage.removeItem(`${INVITES_KEY}_${id}`);
  
  return updated;
}

export function duplicateProject(id: string): Project[] {
  const projects = getProjects();
  const original = projects.find(p => p.id === id);
  if (!original) return projects;
  
  const duplicate: Project = {
    ...original,
    id: Date.now().toString(),
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updated = [duplicate, ...projects];
  saveProjects(updated);
  
  // Copy members to new project
  const members = getMembers(id);
  setMembers(duplicate.id, members);
  
  return updated;
}

export function renameProject(id: string, newName: string): Project[] {
  return updateProject(id, { name: newName });
}

export function toggleArchive(id: string): Project[] {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return projects;
  
  return updateProject(id, { archived: !project.archived, active: false });
}

export function toggleFavorite(id: string): Project[] {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return projects;
  
  return updateProject(id, { favorite: !project.favorite });
}

export function searchProjects(projects: Project[], query: string): Project[] {
  const lowerQuery = query.toLowerCase();
  return projects.filter(p => 
    p.name.toLowerCase().includes(lowerQuery)
  );
}

export function filterProjects(projects: Project[], filter: 'all' | 'active' | 'archived' | 'favorites'): Project[] {
  switch (filter) {
    case 'active':
      return projects.filter(p => p.active && !p.archived);
    case 'archived':
      return projects.filter(p => p.archived);
    case 'favorites':
      return projects.filter(p => p.favorite);
    default:
      return projects;
  }
}

export function sortProjects(projects: Project[], sortBy: 'recent' | 'name'): Project[] {
  const sorted = [...projects];
  
  if (sortBy === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    sorted.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  
  return sorted;
}

export function exportProject(project: Project): void {
  const dataStr = JSON.stringify(project, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importProjects(data: any): Project[] {
  const projects = getProjects();
  
  // Handle single project or array of projects
  const imported = Array.isArray(data) ? data : [data];
  
  // Validate and clean imported projects
  const validProjects = imported.map((p: any) => {
    const now = new Date().toISOString();
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: p.name || 'Imported Project',
      active: p.active !== false,
      archived: p.archived || false,
      favorite: p.favorite || false,
      createdAt: p.createdAt || now,
      updatedAt: now,
      counters: p.counters || { shots: 0, strips: 0 },
      phase: p.phase || 'pre' as Phase,
    } as Project;
  });
  
  const updated = [...validProjects, ...projects];
  saveProjects(updated);
  return updated;
}

// Member functions (new)
export function getMembers(projectId: string): Member[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`${MEMBERS_KEY}_${projectId}`);
    if (!stored) {
      // Initialize with default owner if no members exist
      const owner: Member = {
        id: 'current-user',
        name: 'Project Owner',
        email: 'owner@example.com',
        role: 'owner',
        lastActiveAt: new Date().toISOString(),
      };
      setMembers(projectId, [owner]);
      return [owner];
    }
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function setMembers(projectId: string, members: Member[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${MEMBERS_KEY}_${projectId}`, JSON.stringify(members));
}

export function inviteMembers(projectId: string, emails: string[], role: Role): void {
  // Add to pending invites
  const invites = listPendingInvites(projectId);
  const newInvites: PendingInvite[] = emails.map(email => ({
    email,
    role,
    invitedAt: new Date().toISOString(),
    projectId,
  }));
  
  // Filter out duplicates
  const existingEmails = invites.map(i => i.email);
  const uniqueNewInvites = newInvites.filter(i => !existingEmails.includes(i.email));
  
  setPendingInvites(projectId, [...invites, ...uniqueNewInvites]);
  
  // Simulate accepting invite after 1 second (for demo)
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      uniqueNewInvites.forEach(invite => {
        acceptInvite(projectId, invite.email);
      });
    }, 1000);
  }
}

function acceptInvite(projectId: string, email: string): void {
  // Remove from pending
  const invites = listPendingInvites(projectId);
  const invite = invites.find(i => i.email === email);
  if (!invite) return;
  
  const remainingInvites = invites.filter(i => i.email !== email);
  setPendingInvites(projectId, remainingInvites);
  
  // Add to members
  const members = getMembers(projectId);
  const newMember: Member = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    email,
    role: invite.role,
    invited: true,
    lastActiveAt: new Date().toISOString(),
  };
  
  setMembers(projectId, [...members, newMember]);
}

export function updateMemberRole(projectId: string, memberId: string, role: Role): void {
  const members = getMembers(projectId);
  const updated = members.map(m =>
    m.id === memberId ? { ...m, role } : m
  );
  setMembers(projectId, updated);
}

export function removeMember(projectId: string, memberId: string): void {
  const members = getMembers(projectId);
  const updated = members.filter(m => m.id !== memberId);
  setMembers(projectId, updated);
}

export function transferOwnership(projectId: string, newOwnerId: string): void {
  const members = getMembers(projectId);
  const updated = members.map(m => {
    if (m.id === newOwnerId) {
      return { ...m, role: 'owner' as Role };
    }
    if (m.role === 'owner') {
      return { ...m, role: 'editor' as Role };
    }
    return m;
  });
  setMembers(projectId, updated);
}

export function listPendingInvites(projectId: string): PendingInvite[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`${INVITES_KEY}_${projectId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setPendingInvites(projectId: string, invites: PendingInvite[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${INVITES_KEY}_${projectId}`, JSON.stringify(invites));
}

export function cancelInvite(projectId: string, email: string): void {
  const invites = listPendingInvites(projectId);
  const updated = invites.filter(i => i.email !== email);
  setPendingInvites(projectId, updated);
}

export function resendInvite(projectId: string, email: string): void {
  const invites = listPendingInvites(projectId);
  const updated = invites.map(i =>
    i.email === email
      ? { ...i, invitedAt: new Date().toISOString() }
      : i
  );
  setPendingInvites(projectId, updated);
  
  // Simulate accepting after resend (for demo)
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      acceptInvite(projectId, email);
    }, 1000);
  }
}