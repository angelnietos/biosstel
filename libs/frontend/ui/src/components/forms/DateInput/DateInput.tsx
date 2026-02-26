'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FloatingLabel } from '../FloatingLabel';
import { CalendarIcon } from '../../icons/CalendarIcon';
import 'react-day-picker/style.css';

interface TriggerProps {
  displayText: string;
  disabled: boolean;
  onClick: () => void;
}

const DateTrigger = ({ displayText, disabled, onClick }: TriggerProps) => (
  <div className="relative">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[27px] w-[100px] rounded border-none bg-white pl-7 pr-2 text-left text-[12px] font-medium text-black shadow-none transition-colors ${
        disabled 
          ? 'cursor-not-allowed bg-gray-100 text-gray-400' 
          : 'cursor-pointer hover:bg-gray-50'
      }`}
    >
      <span className="truncate block">{displayText}</span>
    </button>
    <CalendarIcon 
      className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" 
    />
  </div>
);

export interface DateInputProps {
  name: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export const DateInput = ({
  name,
  value,
  onChange,
  placeholder = 'dd/mm/aa',
  className = '',
  disabled = false,
  label,
}: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayText = value ? format(value, 'dd/MM/yy') : placeholder;
  const showLabel = label && !!value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const toggleOpen = () => !disabled && setIsOpen(!isOpen);

  const borderStyles = disabled
    ? 'border border-gray-200'
    : 'border border-gray-300 shadow-sm hover:border-gray-400';

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <input type="hidden" name={name} value={value?.toISOString() || ''} />

      <div className={`relative rounded ${borderStyles} bg-white transition-shadow`}>
        {showLabel && (
          <div className="absolute -top-2 left-2 px-1 bg-white z-10 leading-none">
             <FloatingLabel>{label}</FloatingLabel>
          </div>
        )}
        <DateTrigger
          displayText={displayText}
          disabled={disabled}
          onClick={toggleOpen}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-[9999] mt-1 rounded-xl bg-white shadow-xl border border-border-card overflow-hidden">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            locale={es}
            showOutsideDays
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
