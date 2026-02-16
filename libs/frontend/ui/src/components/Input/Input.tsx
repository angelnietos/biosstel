/**
 * @biosstel/ui - Atomic Input Component
 * Pure UI component with no business logic, no fetch, no feature dependencies
 */

export interface InputProps {
  type?: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  id?: string;
}

export const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  className = '',
  error = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  id,
}: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${className} ${error ? 'border-error' : ''}`}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
      id={id}
    />
  );
};

export default Input;
