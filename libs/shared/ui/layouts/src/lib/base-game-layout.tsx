import { PropsWithChildren } from 'react';
import { Themes, ThemeWrapper } from '@shared/theme';
import { AspectRatioWrapper, useAspectRatio } from './use-aspect-ratio';

interface BaseLayoutProps extends PropsWithChildren {
  theme?: Themes;
  showSwitcher?: boolean;
}

export const BaseGameLayout = ({
  theme = Themes.GOLD,
  showSwitcher = false,
  children,
}: BaseLayoutProps) => {
  const { isVertical } = useAspectRatio();

  return (
    <AspectRatioWrapper isVertical={isVertical}>
      <ThemeWrapper theme={theme} showSwitcher={showSwitcher}>
        {children}
      </ThemeWrapper>
    </AspectRatioWrapper>
  );
};
