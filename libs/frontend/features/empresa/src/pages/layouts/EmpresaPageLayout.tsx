/**
 * @biosstel/empresa - EmpresaPageLayout
 * Solo componentes de ui y ui-layout.
 */

'use client';

import { ReactNode } from 'react';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Card } from '@biosstel/ui';

export interface EmpresaPageLayoutProps {
  title: string;
  children: ReactNode;
}

/** Figma: título gray-900 bold, Cards p-5 shadow-sm border-card radius 12px, Stack gap 6 */
export const EmpresaPageLayout = ({ title, children }: EmpresaPageLayoutProps) => (
  <PageContainer>
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">{title}</Heading>
      <Card className="p-5 shadow-sm border border-border-card rounded-xl">{children}</Card>
    </Stack>
  </PageContainer>
);

export default EmpresaPageLayout;
