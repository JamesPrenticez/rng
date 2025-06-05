import { PropsWithChildren } from 'react';
import { Themes, ThemeWrapper } from '@shared/theme';
import { AspectRatioWrapper } from '@shared/hooks';

interface BaseLayoutProps extends PropsWithChildren {
  theme?: Themes;
  showSwitcher?: boolean;
}

export const BaseGameLayout = ({
  theme = Themes.GOLD,
  showSwitcher = false,
  children,
}: BaseLayoutProps) => {

  return (
    <AspectRatioWrapper>
      <ThemeWrapper theme={theme} showSwitcher={showSwitcher}>
        {children}
      </ThemeWrapper>
    </AspectRatioWrapper>
  );
};
