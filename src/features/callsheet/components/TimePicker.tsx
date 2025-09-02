'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string; // HH:mm format
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TimePicker({ 
  value, 
  onChange, 
  placeholder = 'Set time', 
  disabled
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr; // Already in HH:mm format
  };

  const generateTimes = () => {
    const times = [];
    
    // Generate times every 15 minutes
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push({ value: timeStr, label: displayTime });
      }
    }
    
    return times;
  };

  const commonTimes = [
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '18:00', label: '6:00 PM' },
  ];

  const allTimes = generateTimes();

  const handleTimeSelect = (timeValue: string) => {
    onChange(timeValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          input flex items-center justify-between w-full text-left
          ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--neutral-700)]/30' : 'cursor-pointer'}
          ${isOpen ? 'border-[var(--brand)] shadow-[0_0_0_3px_rgba(76,161,138,0.2)]' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
          <span className={value ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>
            {value ? formatDisplayTime(value) : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Quick Times */}
          <div className="p-3 border-b border-[var(--border)]">
            <div className="text-xs font-medium text-[var(--text-muted)] mb-2">Common Times</div>
            <div className="grid grid-cols-2 gap-1">
              {commonTimes.map((time) => (
                <button
                  key={time.value}
                  onClick={() => handleTimeSelect(time.value)}
                  className={`
                    px-2 py-1 text-xs rounded transition-colors text-left
                    ${value === time.value 
                      ? 'bg-[var(--brand)] text-white' 
                      : 'bg-[var(--neutral-700)]/20 hover:bg-[var(--brand)]/20 text-[var(--text)] hover:text-[var(--brand)]'
                    }
                  `}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* All Times */}
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {allTimes.map((time) => (
              <button
                key={time.value}
                onClick={() => handleTimeSelect(time.value)}
                className={`
                  w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--neutral-700)]/20
                  ${value === time.value 
                    ? 'bg-[var(--brand)] text-white' 
                    : 'text-[var(--text)]'
                  }
                `}
              >
                {time.label}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)] flex justify-between items-center">
            <button
              onClick={() => {
                const now = new Date();
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${Math.round(now.getMinutes() / 15) * 15}`.padStart(5, '0');
                handleTimeSelect(currentTime);
              }}
              className="text-sm text-[var(--brand)] hover:text-[var(--brand-700)] transition-colors"
            >
              Now
            </button>
            {value && (
              <button
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}