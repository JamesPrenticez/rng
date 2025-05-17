import { BaseAppProvider, WebSocketProvider } from "@shared/contexts";
import type { PropsWithChildren } from "react"

export const BaseAppLayout = ({ children }: PropsWithChildren) => {
  const socketUrl = 'ws://localhost:5201';
  
  return (
    <WebSocketProvider url={socketUrl}>
      <BaseAppProvider>
        {children}
      </BaseAppProvider>
    </WebSocketProvider>
  )
};
