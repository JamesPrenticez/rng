import styled from '@emotion/styled'
import { Title } from './lobby/title';
import { GameCanvas } from '../game/core/canvas';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  background-color: var(--color-primary);
`

const GameContainer = styled.div`
  width: 50vw;
  height: 50vh;
  border: lime 1px solid;
`

export const Lobby = () => {

  return (
    <Container>
      <Title text="Dice Magic" />

      <GameContainer>
        <GameCanvas />
      </GameContainer>

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
