export interface LegendDotProps {
  color: string;
  label: string;
  cssProps?: string;
}

export const LegendDot = ({ color, label, cssProps = '' }: LegendDotProps) => (
  <div className={`inline-flex items-center gap-2 ${cssProps}`}>
    <div
      className="h-2.5 w-2.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);
