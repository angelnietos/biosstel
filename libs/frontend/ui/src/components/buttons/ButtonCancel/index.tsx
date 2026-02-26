import { Button } from '../Button';

export interface ButtonCancelProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonCancel = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonCancelProps) => {
  const base =
    'inline-flex h-[29px] items-center justify-center rounded border border-gray-350 px-4 text-sm text-black bg-transparent';

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
