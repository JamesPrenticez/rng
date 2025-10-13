import { useMemo } from 'react';
import { useIsMobile } from '@shared/hooks'
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';

import { BaseGameLayout } from '@shared/layouts';
import { Themes } from '@shared/theme';

// import { useUserStore } from '@shared/stores';

export const CoinFlipAppLayout = () => {
  const isMobile = useIsMobile();

  const render = useMemo(() => {
    if (isMobile) {
      return <MobileAppLayout />;
    }

    return <DesktopAppLayout />;
  }, [isMobile]);

  return (
    <BaseGameLayout 
      theme={Themes.GOLD}
      showSwitcher={true}
    >
      {render}
    </BaseGameLayout>
  )
};
