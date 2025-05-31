import styled from '@emotion/styled';
import { useAspectRatio } from '@shared/layouts';
import { Themes, ThemeWrapper } from '@shared/theme';
import { Navbar } from '../components/navbar/navbar';

const Container = styled.div`
  min-height: 100dvh;
  background-color: var(--color-black-20);
`;

export const AppLayoutComponentLibrary = () => {
  useAspectRatio();

  return (
    <ThemeWrapper theme={Themes.PURPLE} showSwitcher>
      <Container>
        <Navbar />
      </Container>
    </ThemeWrapper>
  );
};
