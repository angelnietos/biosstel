/**
 * @biosstel/auth - AuthPageLayout
 * Layout interno de la feature auth. Solo componentes de libs.
 */

import { ReactNode } from 'react';
import { MainContainer, Stack } from '@biosstel/ui-layout';
import { Heading } from '@biosstel/ui';

export interface AuthPageLayoutProps {
  title: string;
  children: ReactNode;
}

export const AuthPageLayout = ({ title, children }: AuthPageLayoutProps) => (
  <MainContainer>
    <Stack gap={8}>
      <Heading level={1}>{title}</Heading>
      {children}
    </Stack>
  </MainContainer>
);

export default AuthPageLayout;
