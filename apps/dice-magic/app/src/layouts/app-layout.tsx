import { useMemo } from 'react';
import { BaseAppLayout, BaseGameLayout } from '@shared/layouts';
import { useAspectRatio } from '@shared/hooks'
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';
import { useUserStore } from '@shared/stores';
import { Themes } from '@shared/theme';

export const DiceMagicAppLayout = () => {
  const isMobile = useAspectRatio();
  const user = useUserStore((s) => s.user);
  console.log(user)

  const render = useMemo(() => {
    if (isMobile) {
      return <MobileAppLayout />;
    }

    return <DesktopAppLayout />;
  }, [isMobile]);

  return (
    <BaseAppLayout>
      <BaseGameLayout theme={Themes.GOLD} showSwitcher={true}>
        {render}
      </BaseGameLayout>
    </BaseAppLayout>
  );
};
