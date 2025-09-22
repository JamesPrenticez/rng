import type { PropsWithChildren } from "react"
import { BaseAppProvider, WebSocketProvider } from "@shared/contexts";
import { DemoCasino } from "@shared/demo-casino";
import { GAME } from "@shared/models";

interface BaseAppProps extends PropsWithChildren {
  type?: "server" | "static"
}

export const BaseAppLayout = ({ 
  type = "static",
  children
}: BaseAppProps) => {
  const socketUrl = 'ws://localhost:3201'; // TODO update this for different apps

  const params = new URLSearchParams(window.location.search);
  const isRoot = window.top === window.self; // Effectivly rending itself, inside itself this prevent recursion.
  // const renderCasino = process.env.NODE_ENV !== 'production' && !params.has('session') && isRoot;
  const renderCasino = process.env.NODE_ENV !== 'production' && isRoot;

  if (renderCasino) {
    return <DemoCasino app={GAME.DICE_MAGIC} />;
  }

  if(type === 'static') {
    return children
  }
  
  return (
    <WebSocketProvider url={socketUrl}>
      <BaseAppProvider>
        {children}
      </BaseAppProvider>
    </WebSocketProvider>
  )
};
