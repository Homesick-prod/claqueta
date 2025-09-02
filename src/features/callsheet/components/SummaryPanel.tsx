'use client';

import { Building, MapPin, Cloud, Calendar, Clock } from 'lucide-react';
import { CallSheetPage } from '../model';

interface SummaryPanelProps {
  page: CallSheetPage;
  onUpdate: (patch: Partial<CallSheetPage>) => void;
}

// Call sheet purposes based on film production research
const CALL_SHEET_PURPOSES = [
  { id: 'principal', label: 'Principal Photography' },
  { id: 'rehearsal', label: 'Rehearsal' },
  { id: 'table-read', label: 'Table Read' },
  { id: 'blocking', label: 'Blocking Rehearsal' },
  { id: 'location-scout', label: 'Location Scout' },
  { id: 'tech-scout', label: 'Tech Scout' },
  { id: 'camera-test', label: 'Camera Test' },
  { id: 'wardrobe-fitting', label: 'Wardrobe Fitting' },
  { id: 'makeup-test', label: 'Makeup Test' },
  { id: 'stunt-rehearsal', label: 'Stunt Rehearsal' },
  { id: 'dance-rehearsal', label: 'Dance Rehearsal' },
  { id: 'music-recording', label: 'Music Recording' },
  { id: 'pickup-shots', label: 'Pickup Shots' },
  { id: 'reshoots', label: 'Reshoots' },
  { id: 'b-roll', label: 'B-Roll' },
  { id: 'insert-shots', label: 'Insert Shots' },
  { id: 'green-screen', label: 'Green Screen' },
  { id: 'vfx-plate', label: 'VFX Plate Shooting' },
  { id: 'photo-shoot', label: 'Photo Shoot' },
  { id: 'interview', label: 'Interview' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'music-video', label: 'Music Video' },
  { id: 'second-unit', label: 'Second Unit' },
  { id: 'splinter-unit', label: 'Splinter Unit' },
  { id: 'crowd-work', label: 'Crowd Work' },
  { id: 'background-work', label: 'Background Work' },
  { id: 'other', label: 'Other' },
];

export default function SummaryPanel({ page, onUpdate }: SummaryPanelProps) {
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
      {/* Call Sheet Purpose & Basic Info */}
      <section>
        <h3 className="callsheet-section-title">
          <Calendar className="w-5 h-5" />
          Call Sheet Details
        </h3>
        <div className="callsheet-grid callsheet-grid-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Purpose</label>
            <select
              value={page.purpose || 'principal'}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              className="input"
            >
              {CALL_SHEET_PURPOSES.map((purpose) => (
                <option key={purpose.id} value={purpose.id}>
                  {purpose.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit/Episode</label>
            <input
              type="text"
              value={page.titleNote || ''}
              onChange={(e) => handleInputChange('titleNote', e.target.value)}
              placeholder="e.g. Episode 1, Unit A"
              className="input"
            />
          </div>
        </div>
        
        <div className="callsheet-grid callsheet-grid-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={page.dateISO?.split('T')[0] || ''}
              onChange={(e) => handleInputChange('dateISO', e.target.value ? `${e.target.value}T00:00:00.000Z` : '')}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Day Number</label>
            <input
              type="number"
              min="1"
              value={page.dayNumber || ''}
              onChange={(e) => handleInputChange('dayNumber', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 1"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              General Crew Call
            </label>
            <input
              type="time"
              value={page.crewCall || ''}
              onChange={(e) => handleInputChange('crewCall', e.target.value)}
              className="input"
            />
          </div>
        </div>
      </section>

      {/* Production Info */}
      <section>
        <h3 className="callsheet-section-title">
          <Building className="w-5 h-5" />
          Production Info
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Production Company</label>
          <input
            type="text"
            value={page.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Production company name"
            className="input"
          />
        </div>
      </section>

      {/* Location */}
      <section>
        <h3 className="callsheet-section-title">
          <MapPin className="w-5 h-5" />
          Location
        </h3>
        <div className="space-y-4">
          <div className="callsheet-grid callsheet-grid-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location Name</label>
              <input
                type="text"
                value={page.location?.name || ''}
                onChange={(e) => handleNestedChange('location', 'name', e.target.value)}
                placeholder="e.g. Central Park"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Map URL</label>
              <input
                type="url"
                value={page.location?.mapUrl || ''}
                onChange={(e) => handleNestedChange('location', 'mapUrl', e.target.value)}
                placeholder="Google Maps or similar link"
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              value={page.location?.address || ''}
              onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
              placeholder="Full address"
              rows={2}
              className="input"
            />
          </div>
          <div className="callsheet-grid callsheet-grid-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Basecamp/Parking</label>
              <input
                type="text"
                value={page.basecamp || ''}
                onChange={(e) => handleInputChange('basecamp', e.target.value)}
                placeholder="Parking information"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Move</label>
              <input
                type="text"
                value={page.companyMove || ''}
                onChange={(e) => handleInputChange('companyMove', e.target.value)}
                placeholder="Unit move note"
                className="input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Weather */}
      <section>
        <h3 className="callsheet-section-title">
          <Cloud className="w-5 h-5" />
          Weather & Sun
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Weather Summary</label>
            <input
              type="text"
              value={page.weather?.summary || ''}
              onChange={(e) => handleNestedChange('weather', 'summary', e.target.value)}
              placeholder="e.g. Partly cloudy, light wind"
              className="input"
            />
          </div>
          <div className="callsheet-grid callsheet-grid-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Temp (°C)</label>
              <input
                type="number"
                value={page.weather?.tempC || ''}
                onChange={(e) => handleNestedChange('weather', 'tempC', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="22"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Wind</label>
              <input
                type="text"
                value={page.weather?.wind || ''}
                onChange={(e) => handleNestedChange('weather', 'wind', e.target.value)}
                placeholder="10 mph NW"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sunrise</label>
              <input
                type="time"
                value={page.weather?.sunrise || ''}
                onChange={(e) => handleNestedChange('weather', 'sunrise', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sunset</label>
              <input
                type="time"
                value={page.weather?.sunset || ''}
                onChange={(e) => handleNestedChange('weather', 'sunset', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}