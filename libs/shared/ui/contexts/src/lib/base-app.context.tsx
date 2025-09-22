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
  UserEvent,
  UsersUpdateEvent,
} from '@shared/events';
import { useWebsocketContext } from './websocket.context';
import { useUserStore } from '@shared/stores';
import { OrbitUserData } from '@shared/models';

export interface BaseAppState {
  users: OrbitUserData[];
}

export interface BaseAppContextProps {
  baseAppState: BaseAppState;
  hasLoaded: boolean;

  setHasLoaded: (loaded: boolean) => void;
}

const BaseAppContext = createContext<BaseAppContextProps | undefined>(undefined);

export const initialState: BaseAppState = {
  users: [],
};

type BaseReducer = (
  baseAppState: BaseAppState,
  event: IBaseEvent<BaseEvents, unknown>[1]
) => BaseAppState;

const baseReducer: BaseReducer = (state, event): BaseAppState => {
  switch (event.event) {
    case BaseEvents.UsersUpdate: {
      const eventData = event as UsersUpdateEvent;
      return {
        ...state,
        users: eventData.payload,
      };
    }

    default:
      return state;
  }
}

type BaseProviderProps = PropsWithChildren

export const BaseAppProvider = ({ children }: BaseProviderProps) => {
  const socket = useWebsocketContext();
  const [baseAppState, dispatch] = useReducer(baseReducer, initialState);
  const [hasLoaded, setHasLoaded] = useState(false);

  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    // Get User from server session and set in Store
    socket.on(BaseEvents.User, (userEvent: UserEvent) => {
      setUser(userEvent.payload.user);
    });

    // Get all Users
    socket.on(BaseEvents.UsersUpdate, (event) => {
      dispatch(event);
    });

    return () => {
      socket.off(BaseEvents.User);
      socket.off(BaseEvents.UsersUpdate);
    };
  }, [
    socket,
    setUser,
  ]);

  const value = useMemo(() => {
    return {
        baseAppState,
        hasLoaded,
        setHasLoaded,
    };
  }, [baseAppState, hasLoaded]);

  return (
    <BaseAppContext.Provider value={value}>{children}</BaseAppContext.Provider>
  );
};

export const useBaseAppContext = (): BaseAppContextProps => {
  const context = useContext(BaseAppContext);
  if (!context) {
      throw new Error('useBaseAppContext must be used within a BaseAppProvider');
  }
  return context;
};

