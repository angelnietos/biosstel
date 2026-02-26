export interface CloseIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const CloseIcon = ({
  width = 13,
  height = 13,
  className = '',
}: CloseIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
