/**
 * @biosstel/auth - AuthPageLayout Component
 * 
 * Layout for auth pages (login, forgot-password, etc.)
 */

import { ReactNode } from 'react';
import { MainContainer } from '@biosstel/ui-layout';

export interface AuthPageLayoutProps {
  title: string;
  children: ReactNode;
}

export const AuthPageLayout = ({ title, children }: AuthPageLayoutProps) => {
  return (
    <MainContainer>
      <h1 className="mb-8 text-h1 font-semibold text-black md:text-datos">
        {title}
      </h1>
      {children}
    </MainContainer>
  );
};

export default AuthPageLayout;
