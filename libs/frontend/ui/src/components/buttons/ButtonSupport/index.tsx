import { Button } from '../Button';
import { QuestionIcon } from '../../icons/QuestionIcon';

export interface ButtonSupportProps {
  disabled?: boolean;
  onClick?: () => void;
  cssProps?: string;
}

export const ButtonSupport = ({
  disabled = false,
  onClick,
  cssProps = '',
}: ButtonSupportProps) => {
  const base =
    'inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-350 text-black bg-white';

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      variant="raw"
      className={`${base} ${cssProps}`}
    >
      <QuestionIcon />
    </Button>
  );
};
