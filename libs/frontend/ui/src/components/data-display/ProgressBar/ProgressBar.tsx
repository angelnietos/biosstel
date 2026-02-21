/**
 * @biosstel/ui - ProgressBar
 * Horizontal bar showing value/max. Colores por variante (Figma). Uso de inline styles para que el color se vea siempre.
 */

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'error' | 'purple' | 'magenta';
  showLabel?: boolean;
  className?: string;
}

const variantFillHex: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  default: '#185c80',   // accent-blue Figma
  success: '#187980',   // accent-teal
  error: '#80182f',     // accent-maroon
  purple: '#5353a5',    // accent-purple
  magenta: '#be185d',   // accent-magenta
};

const TRACK_BG = '#d1d5db'; // gris más visible para el track (Figma: detalle barras)

export const ProgressBar = ({
  value,
  max = 100,
  variant = 'default',
  showLabel = false,
  className = '',
}: ProgressBarProps) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const fillColor = variantFillHex[variant];
  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`.trim()}>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 10, backgroundColor: TRACK_BG }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: fillColor,
            minWidth: pct > 0 ? 6 : 0,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && <span className="text-xs text-gray-500 w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  );
};

export default ProgressBar;
