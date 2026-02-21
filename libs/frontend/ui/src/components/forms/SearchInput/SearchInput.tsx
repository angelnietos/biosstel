/**
 * @biosstel/ui - SearchInput
 * Search field with icon.
 */

'use client';

import { FloatingLabel } from '../FloatingLabel';
import { SearchIcon } from '../../icons/SearchIcon';

export interface SearchInputProps {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cssProps?: string;
  containerCssProps?: string;
}

export const SearchInput = ({
  name,
  placeholder = 'Buscar...',
  value,
  onChange,
  cssProps = '',
  containerCssProps = '',
}: SearchInputProps) => {
  return (
    <div className={`relative ${containerCssProps}`}>
      <FloatingLabel>Buscar</FloatingLabel>
      <input
        type="search"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded border border-gray-350 pl-9 pr-4 py-2 text-mid outline-none ${cssProps}`}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-550">
        <SearchIcon />
      </span>
    </div>
  );
};

export default SearchInput;
