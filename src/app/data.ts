export const features = [
  // Pre-production
  {
    key: 'script_imports',
    title: 'Script & Imports',
    description: 'AI-powered script breakdown with import management',
    status: 'shipped' as const,
    category: 'pre-production'
  },
  {
    key: 'script_breakdown',
    title: 'Script Breakdown',
    description: 'Automatic scene analysis for locations, props, characters',
    status: 'shipped' as const,
    category: 'pre-production'
  },
  {
    key: 'moodboard',
    title: 'Moodboard/Storyboard',
    description: 'Visual references and shot planning tools',
    status: 'in_progress' as const,
    category: 'pre-production'
  },
  {
    key: 'locations',
    title: 'Locations & Floor plan',
    description: 'Location scouting with maps and logistics',
    status: 'in_progress' as const,
    category: 'pre-production'
  },
  {
    key: 'shotlist',
    title: 'Shotlist',
    description: 'Detailed shot planning with lens and movement notes',
    status: 'shipped' as const,
    category: 'pre-production'
  },
  {
    key: 'stripboard',
    title: 'Stripboard / Shooting schedule',
    description: 'Drag & drop scheduling with conflict detection',
    status: 'in_progress' as const,
    category: 'pre-production'
  },
  {
    key: 'calendar',
    title: 'Calendar',
    description: 'Production calendar with crew availability',
    status: 'planned' as const,
    category: 'pre-production'
  },
  {
    key: 'contacts',
    title: 'Contacts & Roles',
    description: 'Team management with role-based permissions',
    status: 'shipped' as const,
    category: 'pre-production'
  },
  {
    key: 'tasks',
    title: 'Tasks/Kanban',
    description: 'Project management with department workflows',
    status: 'planned' as const,
    category: 'pre-production'
  },
  {
    key: 'budget',
    title: 'Budget/Equipment',
    description: 'Budget tracking and equipment management',
    status: 'planned' as const,
    category: 'pre-production'
  },
  {
    key: 'notes',
    title: 'Notes/Risks',
    description: 'Production notes and risk management',
    status: 'planned' as const,
    category: 'pre-production'
  },
  // Production
  {
    key: 'callsheets',
    title: 'Call sheets',
    description: 'Professional PDF generation with LINE notifications',
    status: 'shipped' as const,
    category: 'production'
  },
  {
    key: 'schedule_daily',
    title: 'Daily schedule / Unit move',
    description: 'Real-time schedule updates and location moves',
    status: 'in_progress' as const,
    category: 'production'
  },
  {
    key: 'continuity',
    title: 'Shot progress / Continuity',
    description: 'On-set progress tracking and continuity notes',
    status: 'in_progress' as const,
    category: 'production'
  },
  {
    key: 'dailies',
    title: 'Dailies links',
    description: 'Review footage links and notes distribution',
    status: 'planned' as const,
    category: 'production'
  },
  // Wrap
  {
    key: 'deliverables',
    title: 'Deliverables checklist',
    description: 'Post-production deliverable tracking',
    status: 'planned' as const,
    category: 'wrap'
  },
  {
    key: 'reports',
    title: 'Reports & Post handoff',
    description: 'Final reports and post-production handoff',
    status: 'planned' as const,
    category: 'wrap'
  }
];

export const progress = [
  { key: 'script_imports', title: 'Script & Imports', percent: 90, note: 'AI breakdown complete, import tools refined' },
  { key: 'script_breakdown', title: 'Script Breakdown', percent: 85, note: 'Core analysis working, scene detection active' },
  { key: 'moodboard', title: 'Moodboard/Storyboard', percent: 40, note: 'Reference system built, storyboard tools in progress' },
  { key: 'locations', title: 'Locations & Floor plan', percent: 25, note: 'Location database started, map integration next' },
  { key: 'shotlist', title: 'Shotlist', percent: 80, note: 'Shot planning complete, coverage tools active' },
  { key: 'stripboard', title: 'Stripboard / Shooting schedule', percent: 60, note: 'Basic scheduling working, advanced features in development' },
  { key: 'calendar', title: 'Calendar', percent: 15, note: 'Calendar framework started, availability system planned' },
  { key: 'contacts', title: 'Contacts & Roles', percent: 95, note: 'Fully functional with department-based permissions' },
  { key: 'tasks', title: 'Tasks/Kanban', percent: 10, note: 'Task structure designed, workflow implementation planned' },
  { key: 'budget', title: 'Budget/Equipment', percent: 20, note: 'Budget framework started, equipment tracking next' },
  { key: 'notes', title: 'Notes/Risks', percent: 30, note: 'Note system built, risk management features planned' },
  { key: 'callsheets', title: 'Call sheets', percent: 90, note: 'PDF generation complete, LINE notifications active' },
  { key: 'schedule_daily', title: 'Daily schedule / Unit move', percent: 50, note: 'Schedule updates working, unit move tracking in progress' },
  { key: 'continuity', title: 'Shot progress / Continuity', percent: 35, note: 'Progress tracking built, continuity tools in development' },
  { key: 'dailies', title: 'Dailies links', percent: 15, note: 'Framework planned, integration with review platforms next' },
  { key: 'deliverables', title: 'Deliverables checklist', percent: 5, note: 'Checklist structure designed, tracking system planned' },
  { key: 'reports', title: 'Reports & Post handoff', percent: 10, note: 'Report templates started, handoff workflow planned' }
];

export const roadmap = {
  now: [
    'Stripboard drag & drop refinements',
    'LINE bot notification improvements',
    'Call sheet template customization',
    'Contact role permission system'
  ],
  next: [
    'Calendar Hub with RRULE support',
    'Location permit tracking system',
    'Advanced budgeting tools',
    'File versioning system',
    'Mobile app for on-set capture'
  ],
  later: [
    'Multi-language support (Thai)',
    'Advanced AI script analysis',
    'Integration with post-production tools',
    'Mobile app for Android',
    'Enterprise team features'
  ]
};

export const changelog = [
  {
    date: '2025-09-06',
    type: 'major' as const,
    items: [
      'New cinematic landing page with motion interactions',
      'Complete workflow timeline redesign',
      'LINE integration with two-way chat simulation',
      'Progress tracking system wired to live data'
    ]
  },
  {
    date: '2025-09-05',
    type: 'minor' as const,
    items: [
      'Call sheet PDF generation improvements',
      'Contact role system enhancements',
      'Bug fixes in stripboard sorting'
    ]
  },
  {
    date: '2025-09-04',
    type: 'major' as const,
    items: [
      'Initial LINE bot integration',
      'Notification timing system (T-24, T-2, T-10)',
      'Emergency contact section in call sheets'
    ]
  },
  {
    date: '2025-09-03',
    type: 'minor' as const,
    items: [
      'AI breakdown accuracy improvements',
      'Shot planning interface redesign',
      'Project template system launch'
    ]
  },
  {
    date: '2025-09-02',
    type: 'major' as const,
    items: [
      'Stripboard scheduling system launch',
      'Department-based contact management',
      'Call sheet auto-generation from stripboard'
    ]
  }
];

export const workflowSteps = [
  {
    phase: 'Before',
    title: 'Pre-Production',
    actions: ['AI Breakdown', 'Location Scout', 'Shot Planning', 'Schedule Creation'],
    outputs: ['Stripboard', 'Shot Lists', 'Location Database', 'Crew Contacts']
  },
  {
    phase: 'During', 
    title: 'Production',
    actions: ['Call Sheet Generation', 'Daily Updates', 'Progress Tracking', 'LINE Notifications'],
    outputs: ['PDF Call Sheets', 'ICS Calendar', 'Progress Reports', 'Crew Alerts']
  },
  {
    phase: 'After',
    title: 'Wrap',
    actions: ['Final Reports', 'Asset Handoff', 'Archive Management', 'Post Coordination'],
    outputs: ['Wrap Reports', 'Asset Database', 'Delivery Notes', 'Archive System']
  }
];

export const lineMessages = [
  {
    sender: 'crew',
    message: 'What time is crew call tomorrow?',
    timestamp: '14:30'
  },
  {
    sender: 'claqueta',
    message: '📋 Tomorrow\'s call sheet is ready! Crew call: 6:00 AM',
    timestamp: '14:31',
    hasAttachment: true,
    attachmentType: 'call_sheet'
  },
  {
    sender: 'crew', 
    message: 'Where are we shooting exactly?',
    timestamp: '14:32'
  },
  {
    sender: 'claqueta',
    message: '🗺️ Location: Studio B - Here\'s the map link',
    timestamp: '14:32',
    hasAttachment: true,
    attachmentType: 'map'
  },
  {
    sender: 'claqueta',
    message: '⏰ T-24 reminder: Weather looks good, no delays expected',
    timestamp: '18:00'
  },
  {
    sender: 'claqueta',
    message: '⏰ T-2 reminder: Makeup trailer arriving at 5:30 AM',
    timestamp: '04:00'
  },
  {
    sender: 'crew',
    message: 'Are we ready to start?',
    timestamp: '05:50'
  },
  {
    sender: 'claqueta',
    message: '🎬 Start shooting in 10 minutes - all departments ready',
    timestamp: '05:51'
  }
];

export const faqData = [
  {
    question: 'How does Claqueta save time in film production?',
    answer: 'Claqueta automates repetitive tasks like call sheet generation, script breakdown, and crew notifications. What used to take hours now takes minutes, letting you focus on creative decisions.'
  },
  {
    question: 'What\'s included in the beta?',
    answer: 'The beta includes script breakdown, stripboard scheduling, call sheet generation, contact management, and LINE notifications. All core production management features are available.'
  },
  {
    question: 'How much does Claqueta cost?',
    answer: 'Claqueta is free during the beta period. Post-beta pricing will be subscription-based for teams, with transparent pricing and no hidden costs.'
  },
  {
    question: 'Is there Thai language support?',
    answer: 'Thai localization is planned for the "Later" roadmap phase. Currently, the interface is in English with LINE integration supporting Thai messages.'
  },
  {
    question: 'How secure is my production data?',
    answer: 'Your data belongs to you, always exportable, with industry-standard security. We don\'t share production information and follow film industry privacy practices.'
  },
  {
    question: 'How do I join the beta?',
    answer: 'Click "Try the Beta" to access the production hub. Beta access is currently free and open to filmmakers.'
  },
  {
    question: 'Can I see what\'s being developed next?',
    answer: 'Yes! Check our <a href="#roadmap" class="text-[var(--brand)] hover:underline">development roadmap</a> for upcoming features and timelines.'
  },
  {
    question: 'What if I need a feature that\'s not built yet?',
    answer: 'Feedback drives our development priorities. Contact us with your needs - solo developer building for real filmmakers means your input directly shapes the product.'
  }
];

// Get current time in UTC+7 (Asia/Bangkok)
export const getLastUpdated = () => {
  const now = new Date();
  const utc7 = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return utc7.toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' UTC+7';
};