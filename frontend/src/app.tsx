import { SocketProvider } from './context/room-state.context';

import { Lobby } from './components/lobby';
import { useApplyTheme } from './hooks/use-theme.hook';

export const App = () => {
  useApplyTheme();
  
  return (
      <SocketProvider>
          <Lobby />
      </SocketProvider>
  );
};
