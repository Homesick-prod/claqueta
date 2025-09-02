'use client';

import { FileText, Shield, Phone } from 'lucide-react';
import { CallSheetPage } from '../model';

interface NotesPanelProps {
  page: CallSheetPage;
  onUpdate: (patch: Partial<CallSheetPage>) => void;
}

export default function NotesPanel({ page, onUpdate }: NotesPanelProps) {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    const current = (page as any)[parent] || {};
    onUpdate({
      [parent]: {
        ...current,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Unit Notes */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Unit Notes
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">General Production Notes</label>
          <textarea
            value={page.unitNotes || ''}
            onChange={(e) => handleInputChange('unitNotes', e.target.value)}
            placeholder="Important information for the cast and crew..."
            rows={6}
            className="input resize-none"
          />
        </div>
      </section>

      {/* Safety Notes */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Safety Information
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Safety Guidelines & Protocols</label>
          <textarea
            value={page.safety || ''}
            onChange={(e) => handleInputChange('safety', e.target.value)}
            placeholder="Safety protocols, hazards to be aware of, special precautions..."
            rows={6}
            className="input resize-none"
          />
        </div>
      </section>

      {/* Emergency Information */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Emergency Information
        </h3>
        
        <div className="space-y-4">
          {/* Hospital Information */}
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="font-medium mb-3 text-red-400">Nearest Hospital</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hospital Name</label>
                <input
                  type="text"
                  value={page.emergency?.hospital?.name || ''}
                  onChange={(e) => handleNestedChange('emergency', 'hospital', { 
                    ...page.emergency?.hospital, 
                    name: e.target.value 
                  })}
                  placeholder="Hospital name"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emergency Phone</label>
                <input
                  type="tel"
                  value={page.emergency?.hospital?.phone || ''}
                  onChange={(e) => handleNestedChange('emergency', 'hospital', { 
                    ...page.emergency?.hospital, 
                    phone: e.target.value 
                  })}
                  placeholder="Emergency contact number"
                  className="input"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                value={page.emergency?.hospital?.address || ''}
                onChange={(e) => handleNestedChange('emergency', 'hospital', { 
                  ...page.emergency?.hospital, 
                  address: e.target.value 
                })}
                placeholder="Full hospital address with directions"
                rows={3}
                className="input resize-none"
              />
            </div>
          </div>

          {/* Other Emergency Information */}
          <div>
            <label className="block text-sm font-medium mb-2">Other Emergency Contacts & Information</label>
            <textarea
              value={page.emergency?.other || ''}
              onChange={(e) => handleNestedChange('emergency', 'other', e.target.value)}
              placeholder="Local police, fire department, location manager emergency contact, etc."
              rows={4}
              className="input resize-none"
            />
          </div>

          {/* Emergency Numbers Reference */}
          <div className="p-4 bg-[var(--neutral-700)]/10 rounded-lg">
            <h5 className="font-medium mb-2">Standard Emergency Numbers</h5>
            <div className="text-sm text-[var(--text-muted)] space-y-1">
              <div className="flex justify-between">
                <span>Emergency Services:</span>
                <span className="font-mono">911</span>
              </div>
              <div className="flex justify-between">
                <span>Poison Control:</span>
                <span className="font-mono">1-800-222-1222</span>
              </div>
              <p className="mt-2 text-xs italic">
                Always call 911 first in case of serious emergency
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}