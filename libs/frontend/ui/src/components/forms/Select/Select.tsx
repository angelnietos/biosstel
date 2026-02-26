import type { ChangeEvent } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  name: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
}

export const Select = ({
  name,
  options,
  value,
  onChange,
  placeholder,
  className = '',
  error = false,
  disabled = false,
  id,
}: SelectProps) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={className + (error ? ' border-error' : '')}
      disabled={disabled}
      id={id}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
