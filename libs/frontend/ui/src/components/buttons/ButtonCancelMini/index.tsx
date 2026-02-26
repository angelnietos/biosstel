import { Button } from '../Button';

export interface ButtonCancelMiniProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonCancelMini = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonCancelMiniProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center rounded border border-gray-350 px-3 text-sm text-black bg-transparent';

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${cssProps}`}
    >
      {children}
    </Button>
  );
};
