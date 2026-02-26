/**
 * @biosstel/ui - Atomic Input Component
 * Pure UI component. Supports optional floating label (Figma).
 */

'use client';

import { useState } from 'react';

export interface InputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  id?: string;
  /** Optional label; when set, shows as floating label when focused or has value */
  label?: string;
  required?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = ({
  type = 'text',
  name = '',
  placeholder,
  value,
  onChange,
  className = '',
  error = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  id,
  label,
  required,
  onFocus,
  onBlur,
  onKeyDown,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = label && (isFocused || (value != null && value !== ''));

  return (
    <div className="relative">
      {showLabel && (
        <span className="absolute -top-3 left-2 bg-white px-2 text-mid font-medium leading-normal text-gray-550">
          {label}
        </span>
      )}
      <input
        type={type}
        name={name}
        placeholder={showLabel ? '' : placeholder}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onKeyDown={onKeyDown}
        className={`${className} ${error ? 'border-error' : ''}`}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        id={id}
        required={required}
      />
    </div>
  );
};

export default Input;
