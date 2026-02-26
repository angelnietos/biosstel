import { Button } from '../Button';
import { PlusIcon } from '../../icons/PlusIcon';

export interface ButtonAddPrimaryProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonAddPrimary = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonAddPrimaryProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center gap-1.5 rounded px-3 text-sm text-white shadow-button';
  const state = disabled ? 'bg-button-disabled' : 'bg-black';

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${state} ${cssProps}`}
    >
      <PlusIcon className={disabled ? 'opacity-50' : ''} />
      {children}
    </Button>
  );
};
