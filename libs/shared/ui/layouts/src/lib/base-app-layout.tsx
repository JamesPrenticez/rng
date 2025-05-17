import { BaseAppProvider, WebSocketProvider } from "@shared/contexts";
import type { PropsWithChildren } from "react"

export const BaseAppLayout = ({ children }: PropsWithChildren) => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  const socketUrl = 'ws://localhost:5201';
  
  return (
    <WebSocketProvider url={socketUrl}>
      <BaseAppProvider>
        {children}
      </BaseAppProvider>
    </WebSocketProvider>
  )
};
