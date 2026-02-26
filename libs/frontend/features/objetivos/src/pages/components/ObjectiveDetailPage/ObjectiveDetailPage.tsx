/**
 * @biosstel/objetivos - Detalle de Objetivo
 * Vista de un objetivo por ID. Layout Figma (mismo estilo que Objetivos Terminales).
 */

'use client';

import { useDashboardHome } from '../../..';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Text, Card, Skeleton, Alert } from '@biosstel/ui';
import { ObjectiveCard } from '../ObjectiveCard';
import { Link } from '@biosstel/platform';
import { type ThemeColor, getObjectiveTypeFromTitle, OBJECTIVE_TYPE_LINKS } from '../../../data-access/models';

export interface ObjectiveDetailPageProps {
  objectiveId: string;
}

const ACCENTS = new Set<ThemeColor>(['maroon', 'teal', 'blue', 'purple', 'magenta']);

export const ObjectiveDetailPage = ({ objectiveId }: ObjectiveDetailPageProps) => {
  const { data, isLoading, error } = useDashboardHome({}, true);
  const objectives = data?.objectives ?? [];
  const objective = objectives.find((o) => o.id === objectiveId);
  const accent = (objective?.accent && ACCENTS.has(objective.accent as ThemeColor)
    ? objective.accent
    : 'blue') as ThemeColor;
  const typeLink = objective ? OBJECTIVE_TYPE_LINKS[getObjectiveTypeFromTitle(objective.title)] : OBJECTIVE_TYPE_LINKS.terminal;

  if (isLoading) {
    return (
      <PageContainer>
        <Stack gap={6}>
          <Skeleton height="lg" className="w-64" />
          <Card className="p-6"><Skeleton height="md" className="w-full" /></Card>
        </Stack>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert variant="error">{error}</Alert>
        <Link href="/objetivos" className="text-sm font-medium text-[#185c80] hover:underline">
          Volver a Niveles de objetivos
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Stack gap={6}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={1} className="text-gray-900">
            Detalle de Objetivo
          </Heading>
          <Link
            href={typeLink.href}
            className="inline-flex items-center h-[43px] px-4 rounded-lg font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300"
          >
            {typeLink.label}
          </Link>
        </div>

        {objective ? (
          <ObjectiveCard
            title={objective.title}
            achieved={objective.achieved}
            objective={objective.objective}
            accent={accent}
            href={typeLink.href}
          />
        ) : (
          <Card className="p-6 border border-border-card">
            <Stack gap={4}>
              <Text variant="body" className="text-muted">
                No se encontró el objetivo con ID <strong>{objectiveId}</strong>.
              </Text>
              <Link
                href="/objetivos"
                className="inline-flex items-center h-[43px] px-4 rounded-lg font-semibold bg-[#111827] text-white hover:bg-black w-fit"
              >
                Volver a Niveles de objetivos
              </Link>
            </Stack>
          </Card>
        )}
      </Stack>
    </PageContainer>
  );
};

export default ObjectiveDetailPage;
