import { Button } from '../Button';
import { AvatarIcon } from '../../icons/AvatarIcon';

export interface ButtonAvatarProps {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const ButtonAvatar = ({
  disabled = false,
  onClick,
  children,
  cssProps = '',
}: ButtonAvatarProps) => {
  const base =
    'inline-flex h-9 items-center justify-center gap-2 rounded-full border border-gray-350 px-3 text-sm text-black bg-white';

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${cssProps}`}
    >
      <AvatarIcon />
      {children}
    </Button>
  );
};
