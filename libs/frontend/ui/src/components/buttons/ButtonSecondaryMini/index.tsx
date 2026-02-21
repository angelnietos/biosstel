import { Button } from '../Button';

export interface ButtonSecondaryMiniProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonSecondaryMini = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonSecondaryMiniProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center rounded border border-gray-350 px-3 text-sm text-black bg-white';
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
