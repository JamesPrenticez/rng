import { useMemo } from 'react';
import { useAspectRatio } from '@shared/hooks';
import { MobileAppLayout } from './app-layout-mobile';
import { DesktopAppLayout } from './app-layout-desktop';
import { BaseGameLayout } from '@shared/layouts';
import { Themes } from '@shared/theme';
import { Toaster } from 'react-hot-toast';

export const DiceMagicAppLayout = () => {
  const isMobile = useAspectRatio();

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
