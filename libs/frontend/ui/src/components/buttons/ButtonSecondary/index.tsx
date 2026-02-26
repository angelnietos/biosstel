import { Button } from '../Button';

export interface ButtonSecondaryProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonSecondary = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonSecondaryProps) => {
  const base =
    'inline-flex h-[29px] items-center justify-center rounded border border-gray-350 px-4 text-sm text-black bg-white';
  const state = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

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
