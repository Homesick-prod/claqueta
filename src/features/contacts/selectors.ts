import { ProjectDirectory, Department, Contact } from './model';

/**
 * Choose primary department deterministically: if multiple, pick the one with smallest `order`
 */
export function derivePrimaryDepartment(contact: Contact, orderedDepts: Department[]): string | null {
  if (!contact.positions || contact.positions.length === 0) {
    return null;
  }
  
  // Get all departments this contact has positions in
  const contactDeptIds = [...new Set(contact.positions.map(p => p.departmentId))];
  
  // Find departments and sort by order
  const contactDepts = contactDeptIds
    .map(id => orderedDepts.find(d => d.id === id))
    .filter(Boolean) as Department[];
  
  if (contactDepts.length === 0) {
    return null;
  }
  
  // Return the department with smallest order
  contactDepts.sort((a, b) => a.order - b.order);
  return contactDepts[0].id;
}

/**
 * Map deptId -> contacts[] sorted by name (uses derivePrimaryDepartment)
 */
export function contactsByPrimaryDept(dir: ProjectDirectory): Record<string, Contact[]> {
  const result: Record<string, Contact[]> = {};
  
  // Initialize all departments
  dir.departments.forEach(dept => {
    result[dept.id] = [];
  });
  
  // Assign contacts to their primary department
  dir.contacts.forEach(contact => {
    const primaryDept = derivePrimaryDepartment(contact, dir.departments);
    if (primaryDept && result[primaryDept]) {
      result[primaryDept].push(contact);
    }
  });
  
  // Sort contacts within each department by name
  Object.keys(result).forEach(deptId => {
    result[deptId].sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      return nameA.localeCompare(nameB);
    });
  });
  
  return result;
}

/**
 * id -> contact
 */
export function getContactsIndex(dir: ProjectDirectory): Record<string, Contact> {
  const index: Record<string, Contact> = {};
  
  dir.contacts.forEach(contact => {
    index[contact.id] = contact;
  });
  
  return index;
}

/**
 * Find contact by email
 */
export function findByEmail(dir: ProjectDirectory, email: string): Contact | undefined {
  if (!email) return undefined;
  
  const normalizedEmail = email.toLowerCase().trim();
  
  return dir.contacts.find(contact =>
    contact.email?.toLowerCase().trim() === normalizedEmail
  );
}

/**
 * Key header contacts for PDF headers / shooting schedule header auto-fill
 */
export type KeyHeaderContacts = {
  director?: Contact;
  firstAD?: Contact;
  dop?: Contact;
  producer?: Contact;
  lineProducer?: Contact;
  productionManager?: Contact;
};

/**
 * Get key header contacts using position name heuristics.
 * Searches for contacts with specific positions and returns the first match.
 * Priority is given to exact matches, then partial matches.
 */
export function getKeyHeaderContacts(dir: ProjectDirectory): KeyHeaderContacts {
  const result: KeyHeaderContacts = {};
  
  // Helper to find contact by position name patterns
  const findByPositionPattern = (patterns: string[]): Contact | undefined => {
    for (const pattern of patterns) {
      const normalizedPattern = pattern.toLowerCase();
      
      // First try exact match
      const exactMatch = dir.contacts.find(contact =>
        contact.positions.some(pos => 
          pos.name.toLowerCase() === normalizedPattern
        )
      );
      
      if (exactMatch) return exactMatch;
      
      // Then try partial match
      const partialMatch = dir.contacts.find(contact =>
        contact.positions.some(pos =>
          pos.name.toLowerCase().includes(normalizedPattern)
        )
      );
      
      if (partialMatch) return partialMatch;
    }
    
    return undefined;
  };
  
  // Director
  result.director = findByPositionPattern([
    'director',
    'co-director'
  ]);
  
  // 1st AD
  result.firstAD = findByPositionPattern([
    '1st assistant director',
    'first assistant director',
    '1st ad',
    'first ad'
  ]);
  
  // DoP/Cinematographer
  result.dop = findByPositionPattern([
    'director of photography',
    'dop',
    'cinematographer',
    'dp'
  ]);
  
  // Producer
  result.producer = findByPositionPattern([
    'producer',
    'executive producer'
  ]);
  
  // Line Producer
  result.lineProducer = findByPositionPattern([
    'line producer'
  ]);
  
  // Production Manager
  result.productionManager = findByPositionPattern([
    'production manager',
    'unit production manager',
    'upm'
  ]);
  
  return result;
}