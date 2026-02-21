import { Button } from '../Button';

export interface ButtonPrimaryMiniProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonPrimaryMini = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonPrimaryMiniProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center rounded px-3 text-sm text-white shadow-button';
  const state = disabled ? 'bg-button-disabled' : 'bg-black';

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${state} ${cssProps}`}
    >
      {children}
    </Button>
  );
};
