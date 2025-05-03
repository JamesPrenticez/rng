import styled from '@emotion/styled'
import { Title } from './lobby/title';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  background-color: var(--color-primary);
`

export const Lobby = () => {

  return (
    <Container>
      <Title text="Dice Magic" />
      {/* <CreateRoom /> */}
      {/* <RoomsList />  */}
    </Container>
  );
};


  // const { user, currentRoom } = useRoomSocket();

  // if (!user) {
  //   return <Login />;
  // }

  // if (currentRoom) {
  //   return <Room />;
  // }
