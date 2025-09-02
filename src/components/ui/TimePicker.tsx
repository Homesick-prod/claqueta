'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // HH:mm format
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  is24Hour?: boolean;
}

export default function TimePicker({ 
  value, 
  onChange, 
  placeholder = 'Set time', 
  disabled, 
  is24Hour = true 
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(() => {
    if (value) {
      const [h] = value.split(':');
      return parseInt(h, 10);
    }
    return 9; // Default to 9 AM
  });
  const [minutes, setMinutes] = useState(() => {
    if (value) {
      const [, m] = value.split(':');
      return parseInt(m, 10);
    }
    return 0;
  });
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
    if (!is24Hour && value) {
      const [h] = value.split(':');
      const hour24 = parseInt(h, 10);
      return hour24 >= 12 ? 'PM' : 'AM';
    }
    return 'AM';
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

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

  // Scroll to selected time when opened
  useEffect(() => {
    if (isOpen && hoursRef.current && minutesRef.current) {
      const hourElement = hoursRef.current.querySelector(`[data-hour="${hours}"]`) as HTMLElement;
      const minuteElement = minutesRef.current.querySelector(`[data-minute="${minutes}"]`) as HTMLElement;
      
      if (hourElement) {
        hourElement.scrollIntoView({ block: 'center' });
      }
      if (minuteElement) {
        minuteElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [isOpen, hours, minutes]);

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour24 = parseInt(h, 10);
    const minute = parseInt(m, 10);

    if (is24Hour) {
      return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } else {
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    }
  };

  const handleTimeSelect = () => {
    let finalHour = hours;
    
    if (!is24Hour) {
      if (period === 'PM' && hours !== 12) {
        finalHour = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        finalHour = 0;
      }
    }

    const timeString = `${finalHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const generateHours = () => {
    const maxHours = is24Hour ? 23 : 12;
    const minHours = is24Hour ? 0 : 1;
    const hoursList = [];
    
    for (let i = minHours; i <= maxHours; i++) {
      hoursList.push(i);
    }
    
    return hoursList;
  };

  const generateMinutes = () => {
    const minutesList = [];
    for (let i = 0; i < 60; i += 5) { // 5-minute intervals
      minutesList.push(i);
    }
    return minutesList;
  };

  const setPresetTime = (presetHour: number, presetMinute: number) => {
    setHours(presetHour);
    setMinutes(presetMinute);
    if (!is24Hour) {
      setPeriod(presetHour >= 12 ? 'PM' : 'AM');
    }
  };

  const presetTimes = [
    { label: '6:00 AM', hour: 6, minute: 0 },
    { label: '9:00 AM', hour: 9, minute: 0 },
    { label: '12:00 PM', hour: 12, minute: 0 },
    { label: '6:00 PM', hour: 18, minute: 0 },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          input flex items-center justify-between w-full
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-[var(--brand)] shadow-[0_0_0_3px_rgba(76,161,138,0.2)]' : ''}
        `}
      >
        <span className={value ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>
          {value ? formatDisplayTime(value) : placeholder}
        </span>
        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          {/* Preset Times */}
          <div className="p-3 border-b border-[var(--border)]">
            <div className="text-xs font-medium text-[var(--text-muted)] mb-2">Quick Select</div>
            <div className="flex gap-2 flex-wrap">
              {presetTimes.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setPresetTime(preset.hour, preset.minute)}
                  className="px-2 py-1 text-xs rounded bg-[var(--neutral-700)]/20 hover:bg-[var(--brand)]/20 text-[var(--text)] hover:text-[var(--brand)] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selectors */}
          <div className="flex">
            {/* Hours */}
            <div className="flex-1 border-r border-[var(--border)]">
              <div className="text-xs font-medium text-[var(--text-muted)] text-center py-2 border-b border-[var(--border)]">
                Hour
              </div>
              <div 
                ref={hoursRef}
                className="h-40 overflow-y-auto custom-scrollbar"
              >
                {generateHours().map((hour) => (
                  <button
                    key={hour}
                    data-hour={hour}
                    onClick={() => setHours(hour)}
                    className={`
                      w-full py-2 text-center text-sm hover:bg-[var(--neutral-700)]/20 transition-colors
                      ${hours === hour ? 'bg-[var(--brand)] text-white' : 'text-[var(--text)]'}
                    `}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex-1 border-r border-[var(--border)]">
              <div className="text-xs font-medium text-[var(--text-muted)] text-center py-2 border-b border-[var(--border)]">
                Minute
              </div>
              <div 
                ref={minutesRef}
                className="h-40 overflow-y-auto custom-scrollbar"
              >
                {generateMinutes().map((minute) => (
                  <button
                    key={minute}
                    data-minute={minute}
                    onClick={() => setMinutes(minute)}
                    className={`
                      w-full py-2 text-center text-sm hover:bg-[var(--neutral-700)]/20 transition-colors
                      ${minutes === minute ? 'bg-[var(--brand)] text-white' : 'text-[var(--text)]'}
                    `}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM for 12-hour format */}
            {!is24Hour && (
              <div className="w-16">
                <div className="text-xs font-medium text-[var(--text-muted)] text-center py-2 border-b border-[var(--border)]">
                  Period
                </div>
                <div className="h-40">
                  {['AM', 'PM'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p as 'AM' | 'PM')}
                      className={`
                        w-full py-2 text-center text-sm hover:bg-[var(--neutral-700)]/20 transition-colors
                        ${period === p ? 'bg-[var(--brand)] text-white' : 'text-[var(--text)]'}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-[var(--border)]">
            <button
              onClick={() => {
                const now = new Date();
                setHours(now.getHours());
                setMinutes(Math.round(now.getMinutes() / 5) * 5); // Round to nearest 5
                if (!is24Hour) {
                  setPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
                }
              }}
              className="text-sm text-[var(--brand)] hover:text-[var(--brand-700)] transition-colors"
            >
              Now
            </button>
            <div className="flex gap-2">
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
              <button
                onClick={handleTimeSelect}
                className="btn btn-primary btn-sm"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}