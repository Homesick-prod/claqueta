'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DatePicker({ value, onChange, placeholder = 'Select date', disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });
  
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

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }

    // Current month days
    const today = new Date();
    const selectedDate = value ? new Date(value) : null;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();

      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        fullDate: currentDate,
      });
    }

    // Next month's leading days
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }

    return days;
  };

  const handleDateSelect = (day: any) => {
    if (!day.isCurrentMonth) {
      // Navigate to the appropriate month and select the date
      const newDate = day.fullDate || new Date(viewDate.getFullYear(), viewDate.getMonth() + (day.date > 15 ? -1 : 1), day.date);
      setViewDate(newDate);
      onChange(newDate.toISOString().split('T')[0]);
    } else {
      const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day.date);
      onChange(selectedDate.toISOString().split('T')[0]);
    }
    setIsOpen(false);
  };

  const navigateMonth = (direction: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const navigateYear = (direction: number) => {
    setViewDate(prev => new Date(prev.getFullYear() + direction, prev.getMonth(), 1));
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    onChange(today.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const days = getDaysInMonth(viewDate);

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
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateYear(-1)}
                className="p-1 hover:bg-[var(--neutral-700)]/20 rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-[var(--neutral-700)]/20 rounded transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-sm">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-[var(--neutral-700)]/20 rounded transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigateYear(1)}
                className="p-1 hover:bg-[var(--neutral-700)]/20 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-3">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    w-8 h-8 text-sm rounded transition-colors flex items-center justify-center
                    ${!day.isCurrentMonth 
                      ? 'text-[var(--text-muted)] hover:bg-[var(--neutral-700)]/20' 
                      : 'text-[var(--text)] hover:bg-[var(--neutral-700)]/20'
                    }
                    ${day.isSelected 
                      ? 'bg-[var(--brand)] text-white hover:bg-[var(--brand-700)]' 
                      : ''
                    }
                    ${day.isToday && !day.isSelected 
                      ? 'bg-[var(--brand)]/20 text-[var(--brand)] font-medium' 
                      : ''
                    }
                  `}
                >
                  {day.date}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-[var(--border)]">
            <button
              onClick={goToToday}
              className="text-sm text-[var(--brand)] hover:text-[var(--brand-700)] transition-colors"
            >
              Today
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