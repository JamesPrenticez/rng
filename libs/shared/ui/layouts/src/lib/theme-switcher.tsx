import styled from '@emotion/styled';
//@ts-ignore
import { Button, ButtonVariants } from '@shared/ui/components/buttons'; // TODO fix ts?
import { Themes } from './theme-wrapper';
import clsx from 'clsx';

import '../styles/fonts.css';
import '../styles/globals.css';

const Container = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 7rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 0.6rem;
  padding: 0.8rem;
  border-radius: 8rem;

  gap: 0.2rem;
  background-color: rgba(var(--color-white-20-opacity), 0.5);
`;

const Dot = styled.div<{ color: string }>`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

interface ThemeSwitcherProps {
  handleSetTheme: (theme: Themes) => void;
}

export const ThemeSwitcher = ({ handleSetTheme }: ThemeSwitcherProps) => {
  return (
    <Container>
      {Object.keys(Themes).map((key) => {
        const themeKey = key as keyof typeof Themes;

        return (
          <Dot
            key={themeKey}
            color={`var(--color-${Themes[themeKey]}-100)`}
            className="button"
            onClick={() => handleSetTheme(Themes[themeKey])}
          >
            {/* {themeKey} */}
          </Dot>
        );
      })}
    </Container>
  );
};
