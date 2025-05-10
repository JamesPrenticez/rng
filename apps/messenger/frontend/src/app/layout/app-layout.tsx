import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import { BaseLayout, Themes } from '@shared/ui/layouts';

const Container = styled.div``;

interface AppLayoutProps {
  isMobile: boolean;
}

export const AppLayout = ({
  isMobile,
  children,
}: PropsWithChildren<AppLayoutProps>) => {
  return (
    <BaseLayout theme={Themes.GOLD} showSwitcher={true} isMobile={isMobile}>
      <Container>{children}</Container>
    </BaseLayout>
  );
};
