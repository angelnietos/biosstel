import { Button } from '../Button';
import { PlusIcon } from '../../icons/PlusIcon';

export interface ButtonAddSecondaryProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
  showIcon?: boolean;
}

export const ButtonAddSecondary = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
  showIcon = true,
}: ButtonAddSecondaryProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center gap-1.5 rounded border border-gray-350 px-3 text-sm text-black bg-white';
  const state = disabled ? 'opacity-50' : '';

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${state} ${cssProps}`}
    >
      {showIcon && <PlusIcon className={disabled ? 'opacity-50' : ''} />}
      {children}
    </Button>
  );
};
