/**
 * @biosstel/ui - InputPassword
 * Password field with show/hide toggle.
 */

'use client';

import { useState } from 'react';
import { Input } from '../Input';
import { EyeIcon } from '../../icons/EyeIcon/EyeIcon';
import { EyeOffIcon } from '../../icons/EyeOffIcon/EyeOffIcon';

export interface InputPasswordProps {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cssProps?: string;
  containerCssProps?: string;
  errorInput?: boolean;
  label?: string;
  /** Alias for cssProps (legacy) */
  className?: string;
  /** Alias for containerCssProps (legacy) */
  containerClassName?: string;
  /** Alias for errorInput (legacy) */
  error?: boolean;
}

export const InputPassword = ({
  name,
  placeholder,
  value,
  onChange,
  cssProps,
  containerCssProps,
  errorInput,
  label,
  className,
  containerClassName,
  error,
}: InputPasswordProps) => {
  const inputCss = cssProps ?? className ?? '';
  const containerCss = containerCssProps ?? containerClassName ?? '';
  const hasError = errorInput ?? error ?? false;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${containerCss}`}>
      <Input
        type={showPassword ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pr-10 ${inputCss}`}
        error={hasError}
        label={label}
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
