import { useMemo } from 'react';
import { useAspectRatio } from '@shared/hooks'
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';

import { BaseGameLayout } from '@shared/layouts';
import { Themes } from '@shared/theme';

// import { useUserStore } from '@shared/stores';

export const JumpQuestAppLayout = () => {
  const isMobile = useAspectRatio();

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
