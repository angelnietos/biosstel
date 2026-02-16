/**
 * @biosstel/dashboard - Objective Card Component
 * 
 * Card displaying objective progress with achieved vs target values.
 */

'use client';

import { Link } from '@biosstel/platform';

export interface ObjectiveCardProps {
  title: string;
  achieved: number;
  objective: number;
  unit?: string;
  accent?: 'maroon' | 'teal' | 'blue' | 'purple';
  href?: string;
}

export const ObjectiveCard = ({
  title,
  achieved,
  objective,
  unit = '',
  accent = 'blue',
  href,
}: ObjectiveCardProps) => {
  const percentage = objective > 0 ? Math.min((achieved / objective) * 100, 100) : 0;
  const pctLabel = `${percentage.toFixed(0)}%`;

  const accentClass =
    accent === 'maroon'
      ? 'bg-accent-maroon'
      : accent === 'teal'
        ? 'bg-accent-teal'
        : accent === 'purple'
          ? 'bg-accent-purple'
          : 'bg-accent-blue';

  const Container: any = href ? Link : 'div';
  const containerProps = href ? { href } : {};

  return (
    <Container
      {...containerProps}
      className={`block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow ${
        href ? 'cursor-pointer' : ''
      }`}
    >
      <div className="text-mid font-semibold text-gray-900 mb-2">{title}</div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <div className="text-datos font-bold text-gray-900 leading-none">
            {achieved.toLocaleString()}
          </div>
          <div className="text-h3 font-semibold text-gray-350 leading-none">
            / {objective.toLocaleString()}
            {unit ? ` ${unit}` : ''}
          </div>
        </div>

        <div className="text-mini font-semibold text-gray-600">{pctLabel}</div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-4 text-mini text-gray-350 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-600" />
            <span>Logrado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
            <span>Objetivo</span>
          </div>
        </div>

        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full ${accentClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </Container>
  );
};

export default ObjectiveCard;
