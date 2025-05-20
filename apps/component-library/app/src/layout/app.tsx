import styled from '@emotion/styled';
import { useAspectRatio } from '@shared/layouts';
import { Themes, ThemeWrapper } from '@shared/theme';

const Container = styled.div`
  min-height: 100dvh;
  background-color: var(--color-background);

  h1 {
    font-family: 'Manuka', sans-serif;
    color: var(--color-primary);
    font-size: 5rem;
    font-weight: 900;
  }
`;

export const AppLayoutComponentLibrary = () => {
  useAspectRatio();

  return (
    <ThemeWrapper theme={Themes.PURPLE} showSwitcher>
      <Container>
        <h1>Component Library Dice Magic</h1>
      </Container>
    </ThemeWrapper>
  );
};
