/**
 * @biosstel/ui - StatusBadge
 * Label + colored dot (e.g. Fichado, Pausado, Finalizado). No raw HTML in features.
 */

export interface StatusBadgeProps {
  label: string;
  status: 'success' | 'warning' | 'error' | 'muted';
  className?: string;
}

const dotColors = { success: 'bg-emerald-500', warning: 'bg-amber-400', error: 'bg-red-400', muted: 'bg-gray-400' } as const;
const textColors = { success: 'text-emerald-600', warning: 'text-amber-600', error: 'text-red-600', muted: 'text-gray-500' } as const;

export const StatusBadge = ({
  label,
  status,
  className = '',
}: StatusBadgeProps) => (
  <span className={`inline-flex items-center gap-1 text-xs font-medium ${textColors[status]} ${className}`.trim()}>
    <span className={`w-2 h-2 rounded-full inline-block ${dotColors[status]}`} aria-hidden />
    {label}
  </span>
);

export default StatusBadge;
