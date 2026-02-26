import { Button } from '../Button';

export interface ButtonCancelLgProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonCancelLg = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonCancelLgProps) => {
  const base =
    'inline-flex h-[43px] w-full items-center justify-center rounded-lg border border-gray-350 px-4 text-sm text-black bg-transparent';

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
