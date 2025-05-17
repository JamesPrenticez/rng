import { PropsWithChildren } from 'react';
import { Themes, ThemeWrapper } from './theme-wrapper';
import { AspectRatioWrapper, useAspectRatioHandler } from './use-aspect-ratio';

interface BaseLayoutProps extends PropsWithChildren {
  theme?: Themes;
  showSwitcher?: boolean;
}

export const BaseGameLayout = ({
  theme = Themes.GOLD,
  showSwitcher = false,
  children,
}: BaseLayoutProps) => {
  const { isVertical } = useAspectRatioHandler();

  return (
    <AspectRatioWrapper isVertical={isVertical}>
      <ThemeWrapper theme={theme} showSwitcher={showSwitcher}>
        {children}
      </ThemeWrapper>
    </AspectRatioWrapper>
  );
};
