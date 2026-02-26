import { IconButton } from '../../IconButton';

export interface AllSelectionButtonPairProps {
  labels: [string, string];
  activeIndex: 0 | 1;
  onChange: (index: 0 | 1) => void;
  cssProps?: string;
}

export const AllSelectionButtonPair = ({
  labels,
  activeIndex,
  onChange,
  cssProps = '',
}: AllSelectionButtonPairProps) => {
  const base =
    'inline-flex h-[27px] items-center justify-center rounded border px-3 text-sm';

  return (
    <div className={`inline-flex rounded border border-gray-350 p-0.5 ${cssProps}`}>
      <button
        type="button"
        onClick={() => onChange(0)}
        className={`${base} ${activeIndex === 0 ? 'border-gray-900 bg-gray-100 text-black' : 'border-transparent text-gray-600'}`}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        onClick={() => onChange(1)}
        className={`${base} ${activeIndex === 1 ? 'border-gray-900 bg-gray-100 text-black' : 'border-transparent text-gray-600'}`}
      >
        {labels[1]}
      </button>
    </div>
  );
};
