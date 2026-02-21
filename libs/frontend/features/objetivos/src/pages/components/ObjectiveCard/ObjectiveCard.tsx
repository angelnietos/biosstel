/**
 * @biosstel/objetivos - Objective Card
 * Solo componentes de ui, ui-layout y shared.
 */

'use client';

import { Card, Text, ProgressBar, LegendDot } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { BlockLink } from '@biosstel/shared';

export interface ObjectiveCardProps {
  title: string;
  achieved: number;
  objective: number;
  unit?: string;
  accent?: 'maroon' | 'teal' | 'blue' | 'purple' | 'magenta';
  href?: string;
}

const accentToVariant: Record<NonNullable<ObjectiveCardProps['accent']>, 'default' | 'success' | 'error' | 'purple' | 'magenta'> = {
  blue: 'default',
  purple: 'purple',
  teal: 'success',
  maroon: 'error',
  magenta: 'magenta',
};

/** Figma: accent colors for progress and percentage (accent-blue, accent-teal, etc.) */
const accentColors: Record<NonNullable<ObjectiveCardProps['accent']>, string> = {
  blue: '#185c80',
  teal: '#187980',
  maroon: '#80182f',
  purple: '#5353a5',
  magenta: '#be185d',
};

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
  const variant = accentToVariant[accent];
  const accentColor = accentColors[accent];

  const content = (
    <Stack gap={3}>
      {/* Figma: title Inter 600, 18px, gray-900 */}
      <Text as="p" className="text-lg font-semibold text-gray-900 leading-[1]">{title}</Text>
      <Stack direction="row" justify="between" align="end" gap={4}>
        <Stack direction="row" gap={2} align="baseline">
          {/* Figma: Logrado 32px, 600, gray-900 */}
          <span className="text-[32px] font-semibold leading-[1] text-gray-900">
            {achieved.toLocaleString()}
          </span>
          {/* Figma: Objetivo 32px, 600, #B6B6B6 */}
          <span className="text-[32px] font-semibold leading-[1] text-gray-300">
            / {objective.toLocaleString()}{unit ? ` ${unit}` : ''}
          </span>
        </Stack>
        {/* Figma: percentage in accent color */}
        <span className="text-mini font-semibold" style={{ color: accentColor }}>{pctLabel}</span>
      </Stack>
      <Stack gap={2}>
        <Stack direction="row" gap={4}>
          <LegendDot color={accentColor} label="Logrado" />
          <LegendDot color="var(--color-gray-300)" label="Objetivo" />
        </Stack>
        <ProgressBar value={percentage} max={100} variant={variant} showLabel={false} />
      </Stack>
    </Stack>
  );

  /* Figma: 12px radius, 1px border-card, white bg — Card already provides border/radius */
  const cardClass = 'p-5 shadow-sm hover:shadow-md transition-shadow';
  if (href) {
    return (
      <BlockLink href={href}>
        <Card className={`${cardClass} cursor-pointer`}>{content}</Card>
      </BlockLink>
    );
  }
  return <Card className={cardClass}>{content}</Card>;
};

export default ObjectiveCard;
