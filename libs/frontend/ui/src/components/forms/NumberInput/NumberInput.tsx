/**
 * @biosstel/ui - NumberInput
 * Atomic numeric input. Figma: bg-input-edit, no spinners.
 */

import { InputHTMLAttributes } from 'react';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumberInput = ({
  value,
  onChange,
  min = 0,
  max,
  className = '',
  ...props
}: NumberInputProps) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    min={min}
    max={max}
    className={`field-sizing-content min-w-[2ch] rounded bg-input-edit px-1.5 py-0.5 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
    {...props}
  />
);

export default NumberInput;
