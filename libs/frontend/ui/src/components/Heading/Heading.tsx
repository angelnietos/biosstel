/**
 * @biosstel/ui - Heading
 * Semantic heading (h1, h2, h3). No custom className in features.
 */

import { ReactNode } from 'react';

export interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

const classMap = {
  1: 'text-2xl font-bold text-gray-900',
  2: 'text-xl font-semibold text-gray-900',
  3: 'text-lg font-semibold text-gray-900',
} as const;

export const Heading = ({
  children,
  level = 1,
  className = '',
}: HeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Tag className={`${classMap[level]} ${className}`.trim()}>{children}</Tag>;
};

export default Heading;
