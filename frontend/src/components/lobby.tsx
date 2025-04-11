import { useRoomSocket } from "../context/room-state.context";

import { Title } from "../ui";

import { CreateRoom } from "./create-room";
import { Login } from "./login";
import { Room } from "./room";
import { RoomsList } from "./room-list";

export const Lobby = () => {
  const { user, currentRoom } = useRoomSocket();

  if (!user) {
    return <Login />;
  }

  if (currentRoom) {
    return <Room />;
  }

  return (
    <>
      <Title>Welcome, {user.username}!</Title>
      <CreateRoom />
      <RoomsList />
    </>
  );
};