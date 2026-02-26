/**
 * @biosstel/ui-layout - Stack
 * Layout primitive: flex container with direction and gap. No business logic.
 */

import { forwardRef, ReactNode } from 'react';

export interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  as?: 'div' | 'section';
  className?: string;
}

const gapMap = { 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' } as const;
const alignMap = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' } as const;
const justifyMap = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' } as const;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack({
  children,
  direction = 'col',
  gap = 4,
  align,
  justify,
  as: Component = 'div',
  className = '',
}, ref) {
  const flexDir = direction === 'row' ? 'flex-row' : 'flex-col';
  const gapClass = gapMap[gap];
  const alignClass = align ? alignMap[align] : '';
  const justifyClass = justify ? justifyMap[justify] : '';
  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} className={['flex', flexDir, gapClass, alignClass, justifyClass, className].filter(Boolean).join(' ').trim()}>
      {children}
    </Component>
  );
});

export default Stack;
