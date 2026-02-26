/**
 * @biosstel/ui - Card
 * Atomic UI component. Figma: rounded-xl, border-border-card.
 */

import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Figma: 12px radius, 1px border-card, bg white. */
export const Card = ({ children, className = '' }: CardProps) => (
  <div
    className={`rounded-2xl border border-border-card bg-white ${className}`}
  >
    {children}
  </div>
);

export default Card;
