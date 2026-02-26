import { Button } from '../Button';

export interface ButtonPrimaryProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonPrimary = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonPrimaryProps) => {
  const baseStyles =
    'inline-flex h-[29px] items-center justify-center rounded px-4 text-sm text-white shadow-button';
  const stateStyles = disabled ? 'bg-button-disabled' : 'bg-black';

  return (
    <Button
      type={type}
      variant="raw"
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${stateStyles} ${cssProps}`}
    >
      {children}
    </Button>
  );
};
