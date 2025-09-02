'use client';

import { useState } from 'react';
import { Shield, Settings, Users } from 'lucide-react';
import { FeaturePolicy, FeatureKey, Contact, PositionRef } from '../model';

interface FeatureAccessPanelProps {
  policies: FeaturePolicy[];
  contacts: Contact[];
  positions: PositionRef[];
  onEditPolicy: (featureKey: FeatureKey) => void;
}

const FEATURES: { key: FeatureKey; name: string; description: string }[] = [
  { key: 'script', name: 'Script', description: 'Script content and revisions' },
  { key: 'breakdown', name: 'Breakdown', description: 'Script breakdown sheets' },
  { key: 'moodboard', name: 'Moodboard', description: 'Visual references and concepts' },
  { key: 'storyboard', name: 'Storyboard', description: 'Shot planning and visualization' },
  { key: 'floorplan', name: 'Floor Plan', description: 'Location layouts and maps' },
  { key: 'shotlist', name: 'Shot List', description: 'Shot planning and management' },
  { key: 'stripboard', name: 'Stripboard', description: 'Shooting schedule strips' },
  { key: 'calendar', name: 'Calendar', description: 'Project timeline and events' },
  { key: 'contacts', name: 'Contacts', description: 'Team directory and roles' },
  { key: 'tasks', name: 'Tasks', description: 'Project task management' },
  { key: 'budget', name: 'Budget', description: 'Financial planning and tracking' },
  { key: 'notes', name: 'Notes', description: 'Project notes and documentation' },
  { key: 'callsheet', name: 'Call Sheets', description: 'Daily production schedules' },
  { key: 'assets', name: 'Assets', description: 'Files and media library' },
  { key: 'integrations', name: 'Integrations', description: 'Third-party connections' }
];

export default function FeatureAccessPanel({
  policies,
  contacts,
  positions,
  onEditPolicy
}: FeatureAccessPanelProps) {
  const [expandedFeature, setExpandedFeature] = useState<FeatureKey | null>(null);

  const getPolicyForFeature = (featureKey: FeatureKey): FeaturePolicy | null => {
    return policies.find(p => p.feature === featureKey) || null;
  };

  const getPolicyDescription = (policy: FeaturePolicy | null): string => {
    if (!policy || policy.mode === 'ALL_EDITORS') {
      return 'All Editors';
    }

    const restrictions: string[] = [];
    
    if (policy.allowPositions?.length) {
      const positionNames = policy.allowPositions
        .map(id => positions.find(p => p.id === id)?.name)
        .filter(Boolean);
      if (positionNames.length > 0) {
        restrictions.push(`${positionNames.slice(0, 2).join(', ')}${positionNames.length > 2 ? ` + ${positionNames.length - 2} more` : ''}`);
      }
    }
    
    if (policy.allowUserIds?.length) {
      const userCount = policy.allowUserIds.length;
      restrictions.push(`${userCount} user${userCount !== 1 ? 's' : ''}`);
    }

    return restrictions.length > 0 
      ? `Restricted: ${restrictions.join(' + ')}`
      : 'Restricted';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[var(--brand)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Feature Access Control</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Configure who can access different project features
          </p>
        </div>
      </div>

      <div className="card">
        <div className="divide-y divide-[var(--border)]">
          {FEATURES.map((feature) => {
            const policy = getPolicyForFeature(feature.key);
            const isRestricted = policy?.mode === 'RESTRICTED';
            const isExpanded = expandedFeature === feature.key;

            return (
              <div key={feature.key} className="p-4 hover:bg-[var(--neutral-700)]/5 hover:border-[var(--brand)]/20 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{feature.name}</h3>
                      <div className={`
                        inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
                        ${isRestricted 
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                          : 'bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20'
                        }
                      `}>
                        {isRestricted ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {getPolicyDescription(policy)}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      {feature.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onEditPolicy(feature.key)}
                    className="btn btn-ghost p-2 ml-4 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Edit access policy"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {isRestricted && policy && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <div className="text-sm">
                      <div className="text-[var(--text-muted)] mb-2">Access granted to:</div>
                      <div className="flex flex-wrap gap-2">
                        {policy.allowPositions?.map(positionId => {
                          const position = positions.find(p => p.id === positionId);
                          return position ? (
                            <span
                              key={positionId}
                              className="inline-flex items-center px-2 py-1 text-xs bg-[var(--brand)]/10 text-[var(--brand)] rounded-full"
                            >
                              {position.name}
                            </span>
                          ) : null;
                        })}
                        
                        {policy.allowUserIds?.map(userId => {
                          const user = contacts.find(c => c.id === userId);
                          return user ? (
                            <span
                              key={userId}
                              className="inline-flex items-center px-2 py-1 text-xs bg-[var(--accent)]/10 text-[var(--accent)] rounded-full"
                            >
                              {user.name}
                            </span>
                          ) : null;
                        })}
                        
                        {(!policy.allowPositions?.length && !policy.allowUserIds?.length) && (
                          <span className="text-[var(--text-muted)] italic">
                            No specific access granted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}