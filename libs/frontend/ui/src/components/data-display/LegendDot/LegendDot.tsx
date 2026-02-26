'use client';

export interface LegendDotProps {
  label: string;
  color?: string; // fallback if no classes provided
  colorClass?: string;
  textClass?: string;
  filled?: boolean;
  cssProps?: string;
}

export const LegendDot = ({
  label,
  color,
  colorClass = 'bg-blue-500',
  textClass = 'text-gray-900',
  filled = false,
  cssProps = '',
}: LegendDotProps) => (
  <div className={`inline-flex items-center gap-1.5 min-w-0 ${cssProps}`}>
    <div
      className={`size-2.5 shrink-0 rounded-full ${
        filled ? (colorClass || '') : `border border-current ${textClass}`
      }`}
      style={!filled && color ? { borderColor: color } : (filled && color ? { backgroundColor: color } : {})}
    />
    <span className={`truncate text-[12px] font-medium ${textClass}`}>
      {label}
    </span>
  </div>
);
