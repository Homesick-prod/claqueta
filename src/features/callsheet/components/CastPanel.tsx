'use client';

import { Users, Plus, Trash2 } from 'lucide-react';
import { CallSheetPage } from '../model';

interface CastPanelProps {
  page: CallSheetPage;
  onUpdate: (patch: Partial<CallSheetPage>) => void;
}

export default function CastPanel({ page, onUpdate }: CastPanelProps) {
  const handleCastCallChange = (index: number, field: string, value: any) => {
    const castCalls = [...page.castCalls];
    castCalls[index] = { ...castCalls[index], [field]: value };
    onUpdate({ castCalls });
  };

  const addCastCall = () => {
    const castCalls = [...page.castCalls];
    castCalls.push({
      name: '',
      character: '',
      callTime: '',
      muTime: '',
      wrTime: '',
      pickup: '',
      notes: '',
    });
    onUpdate({ castCalls });
  };

  const removeCastCall = (index: number) => {
    const castCalls = [...page.castCalls];
    castCalls.splice(index, 1);
    onUpdate({ castCalls });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Cast Calls
        </h3>
        <button
          onClick={addCastCall}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Cast Member
        </button>
      </div>

      {page.castCalls.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--neutral-700)]/10">
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">Actor</th>
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">Character</th>
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">Call</th>
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">MU</th>
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">WR</th>
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">Pickup</th>
                    <th className="text-left p-3 text-sm font-medium text-[var(--text-muted)]">Notes</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {page.castCalls.map((castCall, index) => (
                    <tr key={index} className="border-b border-[var(--border)] last:border-0">
                      <td className="p-3">
                        <input
                          type="text"
                          value={castCall.name || ''}
                          onChange={(e) => handleCastCallChange(index, 'name', e.target.value)}
                          placeholder="Actor name"
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={castCall.character || ''}
                          onChange={(e) => handleCastCallChange(index, 'character', e.target.value)}
                          placeholder="Character"
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={castCall.callTime || ''}
                          onChange={(e) => handleCastCallChange(index, 'callTime', e.target.value)}
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={castCall.muTime || ''}
                          onChange={(e) => handleCastCallChange(index, 'muTime', e.target.value)}
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={castCall.wrTime || ''}
                          onChange={(e) => handleCastCallChange(index, 'wrTime', e.target.value)}
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={castCall.pickup || ''}
                          onChange={(e) => handleCastCallChange(index, 'pickup', e.target.value)}
                          placeholder="Location"
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={castCall.notes || ''}
                          onChange={(e) => handleCastCallChange(index, 'notes', e.target.value)}
                          placeholder="Notes"
                          className="input w-full"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeCastCall(index)}
                          className="btn btn-ghost text-red-500 p-1"
                          title="Remove cast member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {page.castCalls.map((castCall, index) => (
              <div key={index} className="card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-[var(--text-muted)]">Cast Member #{index + 1}</h4>
                  </div>
                  <button
                    onClick={() => removeCastCall(index)}
                    className="btn btn-ghost text-red-500 p-1"
                    title="Remove cast member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Actor Name</label>
                      <input
                        type="text"
                        value={castCall.name || ''}
                        onChange={(e) => handleCastCallChange(index, 'name', e.target.value)}
                        placeholder="Actor name"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Character</label>
                      <input
                        type="text"
                        value={castCall.character || ''}
                        onChange={(e) => handleCastCallChange(index, 'character', e.target.value)}
                        placeholder="Character name"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Call</label>
                      <input
                        type="time"
                        value={castCall.callTime || ''}
                        onChange={(e) => handleCastCallChange(index, 'callTime', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">MU</label>
                      <input
                        type="time"
                        value={castCall.muTime || ''}
                        onChange={(e) => handleCastCallChange(index, 'muTime', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">WR</label>
                      <input
                        type="time"
                        value={castCall.wrTime || ''}
                        onChange={(e) => handleCastCallChange(index, 'wrTime', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Pickup Location</label>
                    <input
                      type="text"
                      value={castCall.pickup || ''}
                      onChange={(e) => handleCastCallChange(index, 'pickup', e.target.value)}
                      placeholder="Pickup location"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      value={castCall.notes || ''}
                      onChange={(e) => handleCastCallChange(index, 'notes', e.target.value)}
                      placeholder="Additional notes"
                      rows={2}
                      className="input resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium mb-2">No cast calls yet</h4>
          <p className="text-sm mb-4">Add cast members to get started</p>
          <button
            onClick={addCastCall}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add First Cast Member
          </button>
        </div>
      )}
    </div>
  );
}