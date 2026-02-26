'use client';

export interface BasicSelectOption {
  id: number;
  value: string;
}

export interface BasicSelectProps {
  htmlFor: string;
  name: string;
  value: number;
  optionsArray: BasicSelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  cssProps?: string;
}

export const BasicSelect = ({
  htmlFor,
  name,
  value,
  optionsArray,
  onChange,
  cssProps = '',
}: BasicSelectProps) => {
  return (
    <select
      id={htmlFor}
      name={name}
      value={value}
      onChange={onChange}
      className={`text-mid font-medium text-black bg-transparent outline-none cursor-pointer ${cssProps}`}
    >
      {optionsArray.map((option) => (
        <option key={option.id} value={option.id}>
          {option.value}
        </option>
      ))}
    </select>
  );
};
