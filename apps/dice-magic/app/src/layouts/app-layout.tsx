import { useMemo } from 'react';
import { useIsMobile } from '@shared/hooks'
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';
import { useGameContext } from '@dice-magic/contexts';
import { useUserStore } from '@shared/stores';
import { BaseGameLayout } from '@shared/layouts';
import { Themes } from '@shared/theme';
import { Toaster } from 'react-hot-toast';

export const DiceMagicAppLayout = () => {
  const isMobile = useIsMobile();

  //  const user = useUserStore((s) => s.user);
  const { gameState } = useGameContext(); // TODO move to a zustand store
  // console.log(user)
  console.log(gameState.players)

  const render = useMemo(() => {
    if (isMobile) {
      return <MobileAppLayout />;
    }

    return <DesktopAppLayout />;
  }, [isMobile]);

  return (
    <BaseGameLayout theme={Themes.GOLD} showSwitcher={true}>
      {render}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '2rem',
          },
        }}
      />
    </BaseGameLayout>
  );
};
