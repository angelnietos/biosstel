export interface DepartmentBadgeProps {
  label: string;
  textClass: string;
  bgClass: string;
}

export const DepartmentBadge = ({
  label,
  textClass,
  bgClass,
}: DepartmentBadgeProps) => (
  <span
    className={`inline-block rounded px-1 py-0.5 text-sm font-semibold ${textClass} ${bgClass}`}
  >
    {label}
  </span>
);
