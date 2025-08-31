import {
  Home,
  Clapperboard,
  FileUp,
  BookOpen,
  Images,
  MapPin,
  Camera,
  Film,
  Calendar,
  Users,
  KanbanSquare,
  Wallet,
  StickyNote,
  Video,
  ClipboardList,
  Route,
  ClipboardCheck,
  Link2,
  PackageOpen,
  CheckCircle2,
  BarChart3,
  FolderOpen,
  Puzzle,
  Settings,
  LucideIcon
} from 'lucide-react';

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuGroup {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: MenuItem[];
}

export function getProjectMenu(projectId: string): MenuGroup[] {
  return [
    {
      title: 'Overview',
      href: `/projects/${projectId}`,
      icon: Home,
    },
    {
      title: 'Pre-production',
      href: '',
      icon: Clapperboard,
      children: [
        {
          title: 'Script & Imports',
          href: `/projects/${projectId}/imports`,
          icon: FileUp,
        },
        {
          title: 'Script Breakdown',
          href: `/projects/${projectId}/breakdown`,
          icon: BookOpen,
        },
        {
          title: 'Moodboard / Storyboard',
          href: `/projects/${projectId}/moodboard`,
          icon: Images,
        },
        {
          title: 'Locations & Floor plan',
          href: `/projects/${projectId}/locations`,
          icon: MapPin,
        },
        {
          title: 'Shotlist',
          href: `/projects/${projectId}/shotlist`,
          icon: Camera,
        },
        {
          title: 'Stripboard / Shooting schedule',
          href: `/projects/${projectId}/stripboard`,
          icon: Film,
        },
        {
          title: 'Calendar',
          href: `/projects/${projectId}/calendar`,
          icon: Calendar,
        },
        {
          title: 'Contacts & Roles',
          href: `/projects/${projectId}/contacts`,
          icon: Users,
        },
        {
          title: 'Tasks / Kanban',
          href: `/projects/${projectId}/tasks`,
          icon: KanbanSquare,
        },
        {
          title: 'Budget / Equipment',
          href: `/projects/${projectId}/budget`,
          icon: Wallet,
        },
        {
          title: 'Notes / Risks',
          href: `/projects/${projectId}/notes`,
          icon: StickyNote,
        },
      ],
    },
    {
      title: 'Production',
      href: '',
      icon: Video,
      children: [
        {
          title: 'Call sheets',
          href: `/projects/${projectId}/callsheets`,
          icon: ClipboardList,
        },
        {
          title: 'Daily schedule / Unit move',
          href: `/projects/${projectId}/daily`,
          icon: Route,
        },
        {
          title: 'Shot progress / Continuity',
          href: `/projects/${projectId}/continuity`,
          icon: ClipboardCheck,
        },
        {
          title: 'Dailies links',
          href: `/projects/${projectId}/dailies`,
          icon: Link2,
        },
      ],
    },
    {
      title: 'Wrap',
      href: '',
      icon: PackageOpen,
      children: [
        {
          title: 'Deliverables checklist',
          href: `/projects/${projectId}/deliverables`,
          icon: CheckCircle2,
        },
        {
          title: 'Reports & Post handoff',
          href: `/projects/${projectId}/reports`,
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Assets / Files',
      href: `/projects/${projectId}/assets`,
      icon: FolderOpen,
    },
    {
      title: 'Integrations',
      href: `/projects/${projectId}/integrations`,
      icon: Puzzle,
    },
    {
      title: 'Project Settings',
      href: `/projects/${projectId}/settings`,
      icon: Settings,
    },
  ];
}