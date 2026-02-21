import { IconButton } from '../../IconButton';
import { PencilIcon } from '../../icons/PencilIcon';

export interface ButtonEditProps {
  disabled?: boolean;
  onClick?: () => void;
  cssProps?: string;
  active?: boolean;
  cancelLabel?: string;
}

export const ButtonEdit = ({
  disabled = false,
  onClick,
  cssProps = '',
  active = false,
  cancelLabel = 'Cancelar',
}: ButtonEditProps) => (
  <IconButton 
    disabled={disabled} 
    onClick={onClick} 
    className={`bg-white border border-gray-200 shadow-sm transition-all ${active ? 'h-7 px-3 gap-2' : 'size-7'} ${cssProps}`}
  >
    <PencilIcon className="w-3.5 h-3.5" />
    {active && (
      <span className="text-[12px] font-medium text-gray-600">{cancelLabel}</span>
    )}
  </IconButton>
);
