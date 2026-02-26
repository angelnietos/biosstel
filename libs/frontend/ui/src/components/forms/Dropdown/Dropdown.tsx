'use client';

import { useState, useRef, useEffect } from 'react';
import { FloatingLabel } from '../FloatingLabel';
import { SelectOption } from '../Select';
import { ArrowDownIcon } from '../../icons/ArrowDownIcon';

interface TriggerProps {
  displayText: string;
  disabled: boolean;
  onClick: () => void;
}

const DropdownTrigger = ({ displayText, disabled, onClick }: TriggerProps) => (
  <div className="relative w-full">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[27px] w-full rounded border-none bg-white pl-2 pr-6 text-left text-[12px] font-medium text-black shadow-none transition-colors ${
        disabled
          ? 'cursor-not-allowed bg-gray-100 text-gray-400'
          : 'cursor-pointer hover:bg-gray-50'
      }`}
    >
      <span className="truncate block">{displayText}</span>
    </button>
    <ArrowDownIcon 
      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-400" 
    />
  </div>
);

export interface DropdownProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown = ({
  name,
  value,
  onChange,
  options,
  placeholder = '',
  label,
  className = '',
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;
  const showLabel = label && !!value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const toggleOpen = () => !disabled && setIsOpen(!isOpen);

  const borderStyles = disabled
    ? 'border border-gray-200'
    : 'border border-gray-300 shadow-sm hover:border-gray-400';

  return (
    <div ref={dropdownRef} className={`relative inline-block min-w-[120px] ${className}`}>
      <input type="hidden" name={name} value={value || ''} />

      <div className={`relative rounded ${borderStyles} bg-white transition-shadow`}>
        {showLabel && (
          <div className="absolute -top-2 left-2 px-1 bg-white z-10 leading-none">
             <FloatingLabel>{label}</FloatingLabel>
          </div>
        )}
        <DropdownTrigger
          displayText={displayText}
          disabled={disabled}
          onClick={toggleOpen}
        />
      </div>

      {isOpen && (
        <ul className="absolute left-0 top-full z-[100] mt-1 min-w-full w-max max-w-[300px] max-h-[250px] overflow-y-auto rounded-lg bg-white p-1 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  value === option.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
