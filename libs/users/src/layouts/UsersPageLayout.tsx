/**
 * @biosstel/users - UsersPageLayout Component
 */

import { ReactNode } from 'react';
import { PageContainer } from '@biosstel/ui-layout';

export interface UsersPageLayoutProps {
  title: string;
  children: ReactNode;
}

export const UsersPageLayout = ({ title, children }: UsersPageLayoutProps) => {
  return (
    <PageContainer>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{title}</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">{children}</div>
    </PageContainer>
  );
};

export default UsersPageLayout;
