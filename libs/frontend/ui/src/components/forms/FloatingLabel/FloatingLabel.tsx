/**
 * @biosstel/ui - FloatingLabel
 * Small label for inputs (Figma: absolute, text-micro, text-gray-550).
 */

import { ReactNode } from 'react';

export interface FloatingLabelProps {
  children: ReactNode;
  className?: string;
}

export const FloatingLabel = ({
  children,
  className = '',
}: FloatingLabelProps) => (
  <span
    className={`absolute -top-1.5 left-1 bg-white px-0.5 text-micro font-medium leading-normal text-gray-550 ${className}`}
  >
    {children}
  </span>
);

export default FloatingLabel;
