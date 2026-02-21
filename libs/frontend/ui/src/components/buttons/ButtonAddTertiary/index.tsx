import { Button } from '../Button';
import { PlusIcon } from '../../icons/PlusIcon';

export interface ButtonAddTertiaryProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
  showIcon?: boolean;
}

export const ButtonAddTertiary = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
  showIcon = true,
}: ButtonAddTertiaryProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center gap-1.5 rounded px-3 text-sm text-black bg-transparent border border-transparent';
  const state = disabled ? 'opacity-50' : '';

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${state} ${cssProps}`}
    >
      {showIcon && <PlusIcon white={false} className={disabled ? 'opacity-50' : ''} />}
      {children}
    </Button>
  );
};
