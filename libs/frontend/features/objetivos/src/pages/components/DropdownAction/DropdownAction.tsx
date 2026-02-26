'use client';

import { useState, useRef, useEffect } from 'react';
import { PlusIcon, type SelectOption } from '@biosstel/ui';

interface Props {
  label: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const DropdownAction = ({
  label,
  options,
  onSelect,
  disabled = false,
  className = '',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const stateStyles = disabled
    ? 'bg-gray-400 cursor-not-allowed'
    : 'bg-black shadow-md cursor-pointer hover:bg-black/90';

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        className={`inline-flex h-[27px] items-center justify-center gap-2 rounded px-3 text-[12px] font-medium text-white transition-colors ${stateStyles}`}
      >
        {label}
        <PlusIcon white className="w-2 h-2" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 top-full z-50 mt-1 min-w-full rounded-lg bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full cursor-pointer whitespace-nowrap rounded px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
