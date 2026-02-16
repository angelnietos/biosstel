/**
 * @biosstel/ui - InputPassword Component
 * Pure UI component with no business logic
 */

'use client';

import { useState } from 'react';
import { Input, type InputProps } from '../Input';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';

export interface InputPasswordProps extends Omit<InputProps, 'type'> {
  containerClassName?: string;
}

export const InputPassword = ({
  name,
  placeholder,
  value,
  onChange,
  className = '',
  containerClassName = '',
  error = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  id,
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${containerClassName}`}>
      <Input
        type={showPassword ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pr-10 ${className}`}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        id={id}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

export default InputPassword;
