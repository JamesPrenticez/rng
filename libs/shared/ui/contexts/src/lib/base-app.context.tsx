import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useReducer,
  useMemo,
} from 'react';
import {
  BaseEvents,
  IBaseEvent,
  ReadyEvent,
  UserEvent,
} from '@shared/events';
import { useSocket } from './websocket.context';
import { useUserStore } from '@shared/stores';

export interface BaseState {
  isReady: boolean;
  passcodeRequired: boolean;
  passcodeState: string;
  passcodeRetriesLeft: number;
}

export interface BaseAppContextProps {
  baseState: BaseState;
  hasLoaded: boolean;

  setHasLoaded: (loaded: boolean) => void;
}

const BaseAppContext = createContext<BaseAppContextProps | undefined>(undefined);

export const initialState: BaseState = {
  isReady: false,
  passcodeRequired: false,
  passcodeState: '',
  passcodeRetriesLeft: 0,
};

type BaseReducer = (
  state: BaseState,
  event: IBaseEvent<BaseEvents, unknown>[1]
) => BaseState;

const isReady = (
  event: IBaseEvent<BaseEvents, unknown>[1]
): event is ReadyEvent => {
  return event.event === BaseEvents.Ready;
};



const baseReducer: BaseReducer = (state, event): BaseState => {
  if (isReady(event)) {
    return {
      ...state,
      isReady: true,
    };
  }

  return state;
};

type BaseProviderProps = PropsWithChildren

export const BaseAppProvider = ({ children }: BaseProviderProps) => {
  const socket = useSocket();
  const [baseState, dispatch] = useReducer(baseReducer, initialState);
  const [hasLoaded, setHasLoaded] = useState(false);

  const setUser = useUserStore((s) => s.setUser);
  const updateUser = useUserStore((s) => s.updateUser);

  useEffect(() => {
    socket.on(BaseEvents.Ready, (readyEvent) => {
      // log.socket(BaseEvents.Ready);
      dispatch(readyEvent);
    });

    socket.on(BaseEvents.PasscodeRequired, (passcodeRequired) => {
      // log.socket(BaseEvents.PasscodeRequired);
      dispatch(passcodeRequired);
    });

    socket.on(BaseEvents.PasscodeIncorrect, (passcodeIncorrect) => {
      // log.socket(BaseEvents.PasscodeIncorrect);
      dispatch(passcodeIncorrect);
    });

    socket.on(BaseEvents.PasscodeAccepted, (passcodeAccepted) => {
      // log.socket(BaseEvents.PasscodeAccepted);
      dispatch(passcodeAccepted);
    });

    // TODO
    // socket.on(BaseEvents.ServerInfo, (event: ServerInfoEvent) => {
    //   setServerInfo({ ...event.payload });
    // });

    socket.on(BaseEvents.User, (userEvent: UserEvent) => {
      // console.log("user")
      // console.log(userEvent)
      setUser(userEvent.payload.user);

      if (userEvent.payload.requireNameChange) {
        // TODO
      }
  });

    return () => {
      socket.off(BaseEvents.Ready);
      socket.off(BaseEvents.PasscodeRequired);
      socket.off(BaseEvents.PasscodeIncorrect);
      socket.off(BaseEvents.PasscodeAccepted);
      socket.off(BaseEvents.User);
    };
  }, [
    socket,
    setUser,
    updateUser,
  ]);



  const value = useMemo(() => {
    return {
        hasLoaded,
        setHasLoaded,
        baseState,
    };
  }, [baseState, hasLoaded]);

  return (
    <BaseAppContext.Provider value={value}>{children}</BaseAppContext.Provider>
  );
};

export const useBaseAppContext = (): BaseAppContextProps => {
  const context = useContext(BaseAppContext);
  if (!context) {
      throw new Error('useSocket must be used within a WebSocketProvider');
  }
  return context;
};

