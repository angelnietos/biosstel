import { IconButton } from '../../IconButton';
import { ActivatedIcon } from '../../icons/ActivatedIcon';
import { DeactivatedIcon } from '../../icons/DeactivatedIcon';

export interface ButtonActivateProps {
  active: boolean;
  disabled?: boolean;
  onClick?: () => void;
  cssProps?: string;
}

export const ButtonActivate = ({
  active,
  disabled = false,
  onClick,
  cssProps = '',
}: ButtonActivateProps) => (
  <IconButton 
    disabled={disabled} 
    onClick={onClick} 
    className={`border border-gray-200 bg-white px-2 py-1.5 shadow-sm gap-2 transition-all ${active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} ${cssProps}`}
  >
    {active ? (
      <DeactivatedIcon className="w-[15px] h-[8px]" />
    ) : (
      <ActivatedIcon className="w-[15px] h-[8px]" />
    )}
    <span className="text-[12px] font-medium">
      {active ? 'Desactivar' : '→ Activar'}
    </span>
  </IconButton>
);
