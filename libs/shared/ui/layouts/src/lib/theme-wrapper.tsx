import { PropsWithChildren, useState } from 'react';

import '@shared/assets/styles/colors.css';
import '@shared/assets/styles/globals.css';
import '@shared/assets/styles/preflight.css';
import '@shared/assets/styles/theme-gold.css';
import '@shared/assets/styles/theme-blue.css';
import '@shared/assets/styles/theme-green.css';
import '@shared/assets/styles/fonts.css';

import styled from '@emotion/styled';
import { ThemeSwitcher } from './theme-switcher';

const Container = styled.div`
  display: contents;
  position: relative;
  overflow: hidden;
  transition: all 2000ms ease-in-out;
`;

export enum Themes {
  GOLD = 'gold',
  BLUE = 'blue',
  GREEN = 'green',
}

export interface Theme {
  theme: Themes;
  showSwitcher?: boolean;
}

export const ThemeWrapper = ({
  theme = Themes.GREEN,
  showSwitcher = false,
  children,
}: PropsWithChildren<Theme>) => {
  const [activeTheme, setActiveTheme] = useState<Themes>(() => {
    const savedTheme = localStorage.getItem('theme') as Themes | null;
    return savedTheme || theme;
  });

  const handleSetTheme = (theme: Themes) => {
    setActiveTheme(theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <Container
      // style={{ display: 'contents' }}
      className={`theme-${activeTheme}`}
    >
      {showSwitcher && <ThemeSwitcher handleSetTheme={handleSetTheme} />}

      {children}
    </Container>
  );
};
