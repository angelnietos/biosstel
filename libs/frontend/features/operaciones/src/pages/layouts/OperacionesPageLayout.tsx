/**
 * @biosstel/operaciones - OperacionesPageLayout
 * Solo componentes de ui y ui-layout.
 */

'use client';

import { ReactNode } from 'react';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Card } from '@biosstel/ui';

export interface OperacionesPageLayoutProps {
  title: string;
  children: ReactNode;
}

/** Figma: título gray-900 bold, Card p-5 shadow-sm border-card radius 12px, Stack gap 6 */
export const OperacionesPageLayout = ({ title, children }: OperacionesPageLayoutProps) => (
  <PageContainer>
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">{title}</Heading>
      <Card className="p-5 shadow-sm border border-border-card rounded-xl">{children}</Card>
    </Stack>
  </PageContainer>
);

export default OperacionesPageLayout;
