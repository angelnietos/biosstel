/**
 * @biosstel/shared - PageContent Component
 * 
 * Generic page content wrapper.
 */

import { ReactNode } from 'react';
import { PageContainer } from '@biosstel/ui-layout';

export interface PageContentProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const PageContent = ({ title, children, className = '' }: PageContentProps) => {
  return (
    <PageContainer className={className}>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{title}</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">{children}</div>
    </PageContainer>
  );
};

export default PageContent;
