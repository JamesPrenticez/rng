import type { PropsWithChildren } from "react"
import { BaseAppProvider, WebSocketProvider } from "@shared/contexts";
import { DemoCasino } from "@shared/demo-casino";

export const BaseAppLayout = ({ children }: PropsWithChildren) => {
  const socketUrl = 'ws://localhost:5201';

  const params = new URLSearchParams(window.location.search);
  const isRoot = window.top === window.self; // Effectivly rending itself, inside itself this prevent recursion.
  // const renderCasino = process.env.NODE_ENV !== 'production' && !params.has('session') && isRoot;
  const renderCasino = process.env.NODE_ENV !== 'production' && isRoot;
  console.log(renderCasino)

  const name = "dice-magic"

  if (renderCasino) {
    return <DemoCasino app={name} />;
  }
  
  return (
    <WebSocketProvider url={socketUrl}>
      <BaseAppProvider>
        {children}
      </BaseAppProvider>
    </WebSocketProvider>
  )
};
