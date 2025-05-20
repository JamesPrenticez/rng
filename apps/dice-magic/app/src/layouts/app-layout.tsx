import { useMemo } from 'react';
import { BaseAppLayout, BaseGameLayout, useAspectRatio } from '@shared/layouts';
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';
import { useUserStore } from '@shared/stores';
import { Themes } from '@shared/theme';

export const DiceMagicAppLayout = () => {
  const { isVertical } = useAspectRatio();
  const user = useUserStore((s) => s.user);
  console.log(user)

  const render = useMemo(() => {
    if (isVertical) {
      return <MobileAppLayout />;
    }

    return <DesktopAppLayout />;
  }, [isVertical]);

  return (
    <BaseAppLayout>
      <BaseGameLayout theme={Themes.GOLD} showSwitcher={true}>
        {render}
      </BaseGameLayout>
    </BaseAppLayout>
  );
};
