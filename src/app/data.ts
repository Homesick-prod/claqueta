// src/data/data.ts
export type Status = 'shipped' | 'in_progress' | 'planned';
export type ChangeType = 'major' | 'minor';

export const HERO = {
  headlineLines: ["Claqueta","Film Production","Management"],
  tagline: "Plan. Shoot. Wrap. All in one place.",
  ctaPrimary: { label: "Try the Beta", href: "/hub" },
  ctaSecondary: { label: "Join Waitlist", note: "Early waitlisters may get Pro free for 1 month after GA." }
};

export const FEATURE_BLOCKS = [
  {
    title: "Pre-production Toolkit",
    blurb: "Plan faster and align every department before day one.",
    items: [
      { name: "Script & Imports", desc: "Ingest screenplay files (e.g., Final Draft) ready for breakdown & scheduling." },
      { name: "AI Script Breakdown", desc: "Auto-detect scenes, INT/EXT, day/night, characters, props, locations." },
      { name: "Moodboard / Storyboard", desc: "Collect visual references and key frames to align tone and shots." },
      { name: "Locations & Floor plan", desc: "Store location details, access paths, staging areas, floor plans." },
      { name: "Shotlist", desc: "Lens/movement/coverage per scene; links to breakdown." },
      { name: "Stripboard / Shooting schedule", desc: "Arrange scene boards, schedule days, company moves, DOOD readiness." },
      { name: "Calendar", desc: "Mark key events/rehearsals/meetings, export ICS." },
      { name: "Contacts & Roles (Access Control)", desc: "All crew contacts with roles and granular feature access." },
      { name: "Tasks / Kanban", desc: "Track per-department tasks from To-Do to Done." },
      { name: "Budget / Equipment", desc: "Track gear and line items against your budget." },
      { name: "Notes / Risks", desc: "Centralize notes and risks by scene or shoot day." }
    ]
  },
  {
    title: "On-Set / Production Control",
    blurb: "Keep the day moving with clear calls and real progress.",
    items: [
      { name: "Call Sheets (PDF + ICS)", desc: "Generate and distribute clear call sheets as PDF + ICS." },
      { name: "Daily schedule / Unit move", desc: "Day timeline, unit moves, rally/parking/load-in points." },
      { name: "Shot progress / Continuity", desc: "Track coverage and continuity across departments." },
      { name: "Dailies links", desc: "Centralize viewing links and references after wrap." }
    ]
  },
  {
    title: "Collaboration & LINE Integration",
    blurb: "Two-way updates in your LINE group, not another app.",
    items: [
      { name: "Push Call Sheet", desc: "AD confirms → send PDF + ICS to LINE group automatically." },
      { name: "Shotlist updates", desc: "DP confirms → share latest shotlist link to the group." },
      { name: "Smart reminders", desc: "Auto-notify T-1d, T-2h, T-30m before key times." },
      { name: "Meetings & links", desc: "Calendar invites with Meet link, plus reminders." },
      { name: "Q&A in chat", desc: "Crew asks; bot replies if it knows (e.g., map for Scene 12)." }
    ]
  },
  {
    title: "Wrap & Handoff",
    blurb: "Close the loop like a pro.",
    items: [
      { name: "Deliverables checklist", desc: "Final deliverables and specs ready for post or studio." },
      { name: "Reports & Post handoff", desc: "Timesheets, wrap reports, and handoff docs." }
    ]
  }
];

export const PROGRESS: { name: string; status: Status; percent: number }[] = [
  { name: "Contacts & Roles", status: "in_progress", percent: 80 },
  { name: "Call Sheets", status: "in_progress", percent: 40 },
  { name: "Stripboard", status: "in_progress", percent: 60 },
  { name: "Shotlist", status: "in_progress", percent: 60 },
  { name: "Others (tooling, integrations, etc.)", status: "planned", percent: 10 }
];

export const ROADMAP = {
  now: [
    "Contacts & Roles v1",
    "Call Sheets v1",
    "Stripboard & Shotlist v2 (migrate from old site)"
  ],
  next: [
    "LINE API integration",
    "Localization (Thai first)",
    "Calendar Hub"
  ],
  later: [
    "Blockshot iOS",
    "Conflict/time-cost analytics",
    "Locations DB",
    "Budget",
    "Roles & approvals",
    "Offline-first",
    "Cloud storage & watermarking"
  ]
};

export const CHANGELOG: { date: string; type: ChangeType; text: string }[] = [
  { date: "2025-09-06", type: "major", text: "Landing Page scaffolding" },
  { date: "2025-09-05", type: "minor", text: "Fix Contacts & Roles compatibility" },
  { date: "2025-09-04", type: "major", text: "Remove Call Sheet (broken)" },
  { date: "2025-09-03", type: "major", text: "Fix position & Feature Access Control; add Call Sheet; integrate with Contacts & Roles" },
  { date: "2025-09-02", type: "major", text: "Add Contacts & Roles" },
  { date: "2025-08-31", type: "minor", text: "Add features in Pre/Prod/Wrap; refine UX/UI" },
  { date: "2025-08-24", type: "minor", text: "Hub UX/UI improvements" },
  { date: "2025-08-22", type: "minor", text: "Hub bug fixes" },
  { date: "2025-08-21", type: "major", text: "Hub scaffolding" }
];

export const FAQ = [
  { q: "What is Claqueta?", a: "A film production management tool that centralizes pre-production, on-set control, and wrap. No fake data; we show real status." },
  { q: "How is it different?", a: "Built for real production workflows: contacts & roles with access control, shotlist/stripboard, call sheets (PDF+ICS), and LINE integration so crews stay in the apps they already use." },
  { q: "Will it save time?", a: "Yes—align departments earlier and automate distribution (PDF/ICS/LINE) to reduce re-sending files and manual reminders." },
  { q: "Is there Thai language support?", a: "Localization starts with Thai (on the roadmap). More languages later." },
  { q: "How much does it cost?", a: "Beta is free. After GA: Free tier, Pro $15/mo, Studio $25/mo. Details will be announced before GA." },
  { q: "How do I join the beta?", a: "Click Try the Beta to open the hub, or Join Waitlist to leave your email and role. Early waitlisters may get Pro free for 1 month after GA." },
  { q: "Privacy & data?", a: "We avoid fake data and stay transparent. More details will be published before GA." }
];

export const PRICING = [
  { tier: "Free (Beta)", price: "$0", note: "During beta: free." },
  { tier: "Free",        price: "$0", note: "After GA: base limits to be announced." },
  { tier: "Pro",         price: "$15 / mo", note: "Details to be announced pre-GA." },
  { tier: "Studio",      price: "$25 / mo", note: "Details to be announced pre-GA." }
];

export const LINE_DEMO = [
  { from: "claqueta", text: "Call Sheet confirmed by AD (D-3 at 20:00). Sending PDF + ICS…", meta: "to LINE group" },
  { from: "claqueta", text: "Meeting scheduled tomorrow 10:00 with Meet link. I'll remind everyone 2 hours before." },
  { from: "dp",       text: "Shotlist updated (Scene 12-14). Please see the latest version." },
  { from: "claqueta", text: "New Shotlist link posted." },
  { from: "crew",     text: "Where is Scene 12 location?" },
  { from: "claqueta", text: "Map pinned for Scene 12 (Parking at Gate B)." },
  { from: "claqueta", text: "T-1d: Tomorrow we shoot. Get a good rest." },
  { from: "claqueta", text: "T-30m: Company on set in 30 minutes." }
];