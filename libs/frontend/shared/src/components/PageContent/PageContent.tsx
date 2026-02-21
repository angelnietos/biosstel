/**
 * @biosstel/shared - PageContent Component
 *
 * Generic page content wrapper. Uses ui + ui-layout only.
 */

import { ReactNode } from 'react';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Card } from '@biosstel/ui';

export interface PageContentProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const PageContent = ({ title, children, className = '' }: PageContentProps) => (
  <PageContainer className={className}>
    <Stack gap={8}>
      <Heading level={1}>{title}</Heading>
      <Card className="p-6">{children}</Card>
    </Stack>
  </PageContainer>
);

export default PageContent;
