// Project routes - these map to src/app/(project)/projects/[id]/*
export function projectPath(id: string): string {
  return `/projects/${id}`;
}

export function projectShotListPath(id: string): string {
  return `/projects/${id}/shots`;
}

export function projectSchedulePath(id: string): string {
  return `/projects/${id}/schedule`;
}

export function projectContactsPath(id: string): string {
  return `/projects/${id}/contacts`;
}

export function projectSettingsPath(id: string): string {
  return `/projects/${id}/settings`;
}

// Hub routes - these map to src/app/(dashboard)/hub/*
export function hubPath(): string {
  return '/hub';
}