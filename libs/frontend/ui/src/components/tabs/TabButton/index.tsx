export interface TabButtonProps {
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  cssProps?: string;
}

export const TabButton = ({
  active,
  onClick,
  children,
  cssProps = '',
}: TabButtonProps) => {
  const base =
    'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors';
  const state = active
    ? 'bg-gray-900 text-white'
    : 'bg-transparent text-gray-600 hover:bg-gray-100';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${state} ${cssProps}`}
    >
      {children}
    </button>
  );
};
