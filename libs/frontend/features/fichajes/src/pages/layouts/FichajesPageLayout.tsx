/**
 * @biosstel/fichajes - FichajesPageLayout
 * Figma: título gray-900 bold, Stack gap 6. Sin Card wrapper; cada página renderiza sus propias cards.
 */

'use client';

import type { ReactNode } from 'react';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading } from '@biosstel/ui';

export interface FichajesPageLayoutProps {
  title: string;
  children: ReactNode;
}

export const FichajesPageLayout = ({ title, children }: FichajesPageLayoutProps) => (
  <PageContainer>
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">{title}</Heading>
      {children}
    </Stack>
  </PageContainer>
);

export default FichajesPageLayout;
