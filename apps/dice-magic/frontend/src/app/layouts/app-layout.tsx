import styled from '@emotion/styled';
import { PropsWithChildren, useMemo } from 'react';
import { BaseLayout, Themes, useAspectRatioHandler } from '@shared/ui/layouts';
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';

export const AppLayout = () => {
  const { isVertical } = useAspectRatioHandler();

  const render = useMemo(() => {
    if (isVertical) {
      return <MobileAppLayout />;
    }

    return <DesktopAppLayout />;
  }, [isVertical]);

  return (
    <BaseLayout theme={Themes.GOLD} showSwitcher={true}>
      {render}
    </BaseLayout>
  );
};
