/**
 * @biosstel/ui-layout - Grid
 * CSS grid container. No business logic.
 */

import { ReactNode } from 'react';

export interface GridProps {
  children: ReactNode;
  /** Number of columns (responsive: 1 col by default, md: 2 or 3). */
  cols?: 1 | 2 | 3;
  gap?: 2 | 4 | 6;
  as?: 'div' | 'section';
  className?: string;
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
} as const;
const gapMap = { 2: 'gap-2', 4: 'gap-4', 6: 'gap-6' } as const;

export const Grid = ({
  children,
  cols = 1,
  gap = 4,
  as: Component = 'div',
  className = '',
}: GridProps) => (
  <Component className={`grid ${colsMap[cols]} ${gapMap[gap]} ${className}`.trim()}>
    {children}
  </Component>
);

export default Grid;
