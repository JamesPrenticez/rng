import { SocketProvider } from './context/room-state.context';
import { ThemeProvider } from '@emotion/react';

import { Container } from './ui';
import { theme } from "./theme"

import { Lobby } from './components/lobby';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <Container style={{ backgroundColor: theme.colors.background, minHeight: '100vh', paddingTop: '2rem' }}>
          <Lobby />
        </Container>
      </SocketProvider>
    </ThemeProvider>
  );
};
