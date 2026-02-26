/**
 * @biosstel/ui - Text
 * Paragraph / inline text with variant. No custom className in features.
 */

import { ReactNode } from 'react';

export interface TextProps {
  children: ReactNode;
  variant?: 'body' | 'small' | 'muted' | 'mini';
  as?: 'p' | 'span' | 'label' | 'h1' | 'h2' | 'h3';
  className?: string;
}

const variantMap = {
  body: 'text-mid text-gray-900',
  small: 'text-sm text-gray-700',
  muted: 'text-mid text-gray-600',
  mini: 'text-mini text-gray-600',
} as const;

export const Text = ({
  children,
  variant = 'body',
  as: Tag = 'p',
  className = '',
}: TextProps) => (
  <Tag className={`${variantMap[variant]} ${className}`.trim()}>{children}</Tag>
);

export default Text;
