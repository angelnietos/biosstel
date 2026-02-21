import { Button } from '../Button';

export interface ButtonPrimaryLgProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonPrimaryLg = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonPrimaryLgProps) => {
  const base =
    'inline-flex h-[43px] w-full items-center justify-center rounded-lg px-4 text-sm text-white shadow-button';
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
