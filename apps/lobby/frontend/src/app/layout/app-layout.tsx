import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import { BaseLayout, Themes, useAspectRatioHandler } from '@shared/ui/layouts';

const Container = styled.div``;

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { isVertical } = useAspectRatioHandler();

  return (
    <BaseLayout theme={Themes.GOLD} showSwitcher={true} isMobile={isVertical}>
      <Container>{children}</Container>
    </BaseLayout>
  );
};
