export const PlusIcon = ({
  className = '',
  white = false,
}: {
  className?: string;
  white?: boolean;
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={white ? 'white' : 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
);
