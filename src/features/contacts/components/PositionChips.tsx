'use client';

import { Plus } from 'lucide-react';
import { PositionRef } from '../model';

interface PositionChipsProps {
  positions: PositionRef[];
  onClick: () => void;
  maxVisible?: number;
}

export default function PositionChips({ positions, onClick, maxVisible = 3 }: PositionChipsProps) {
  const visiblePositions = positions.slice(0, maxVisible);
  const hiddenCount = Math.max(0, positions.length - maxVisible);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visiblePositions.map((position) => (
        <span
          key={position.id}
          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 rounded-full"
        >
          {position.name}
        </span>
      ))}
      
      {hiddenCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[var(--neutral-700)]/10 text-[var(--text-muted)] border border-[var(--neutral-700)]/20 rounded-full">
          +{hiddenCount} more
        </span>
      )}
      
      <button
        onClick={onClick}
        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[var(--neutral-700)]/5 text-[var(--text-muted)] border border-[var(--neutral-700)]/20 rounded-full hover:bg-[var(--neutral-700)]/10 transition-colors"
        title="Edit positions"
      >
        <Plus className="w-3 h-3 mr-1" />
        {positions.length === 0 ? 'Add positions' : 'Edit'}
      </button>
    </div>
  );
}