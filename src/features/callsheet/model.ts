export type CallSheetPage = {
  id: string;
  title: string;            // default "Page 1", "Page 2", ...; inline rename allowed
  purpose?: string;         // call sheet purpose (principal, rehearsal, etc.)
  dateISO?: string;         // shoot date (ISO)
  dayNumber?: number;       // Day # (optional)
  titleNote?: string;       // unit/episode label

  // Summary
  company?: string;
  crewCall?: string;        // e.g. "06:00"
  location?: { name?: string; address?: string; mapUrl?: string };
  basecamp?: string;        // or parking info
  companyMove?: string;     // unit move note

  // Weather (manual MVP)
  weather?: {
    summary?: string;
    tempC?: number;
    sunrise?: string;
    sunset?: string;
    wind?: string;
    humidity?: string;
  };

  // Cast calls
  castCalls: Array<{
    contactId?: string;     // if from Contacts
    name?: string;          // free-text if not from Contacts
    character?: string;
    callTime?: string;      // "HH:mm"
    muTime?: string;        // makeup
    wrTime?: string;        // wardrobe
    pickup?: string;
    notes?: string;
  }>;

  // Crew by department
  crewByDept: Array<{
    deptId: string;
    deptName: string;       // department display name
    deptCall?: string;
    members: Array<{
      contactId?: string;
      name?: string;        // fallback if not in Contacts
      position?: string;    // display label
      callTime?: string;
      note?: string;
    }>;
  }>;

  // Notes / Emergency
  unitNotes?: string;
  safety?: string;
  emergency?: {
    hospital?: { name?: string; address?: string; phone?: string };
    other?: string;
  };

  // Distribution (mock)
  distributionContactIds: string[];

  createdAt: string;
  updatedAt: string;
};

export type CallSheetDoc = {
  projectId: string;
  pages: CallSheetPage[];   // at least one page
  activePageId: string;     // which page is being edited/displayed
};