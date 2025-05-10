import { PropsWithChildren, useMemo } from 'react';
import { Themes, ThemeWrapper } from './theme-wrapper';
import styled from '@emotion/styled';
import { AspectRatioWrapper } from './use-aspect-ratio';

const LayoutWrapper = styled.div`
  font-size: 2.6rem;
  color: var(--color-primary);
  background-color: var(--color-background);
  position: relative;
  height: 100dvh;

  box-sizing: border-box;
  border: lime solid 1px;

  /* main {

  } */
`;

interface BaseLayoutProps extends PropsWithChildren {
  theme?: Themes;
  showSwitcher?: boolean;
  isMobile: boolean;
}

export const BaseLayout = ({
  theme = Themes.GOLD,
  showSwitcher = false,
  isMobile,
  children,
}: BaseLayoutProps) => {
  return (
    <AspectRatioWrapper isVertical={isMobile}>
      <ThemeWrapper theme={theme} showSwitcher={showSwitcher}>
        <LayoutWrapper>
          <main>{children}</main>
        </LayoutWrapper>
      </ThemeWrapper>
    </AspectRatioWrapper>
  );
};
