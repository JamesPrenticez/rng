import { useGameContext } from '@dice-magic/contexts';
import { PlayerData } from '@dice-magic/models';
import styled from '@emotion/styled';
import { Button } from '@shared/components';
import { useBaseAppContext } from '@shared/contexts';
import { useUserStore } from '@shared/stores';
import { useMemo } from 'react';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem;

  color: var(--color-text);
  font-size: 2.4rem;
  display: flex;
  flex-direction: column;

  z-index: 9999;
`;

export const UsersInRoom = () => {
  const { baseAppState } = useBaseAppContext();
  const { gameState, gameInfo, handlePlayerSit, handlePlayerLeaveSeat } =
    useGameContext();
  const user = useUserStore((s) => s.user);
  const totalSeats = gameInfo.settings.tableSeatLimit;

  const handleSitOrLeave = (seat: number, isPlayer: boolean) => {
    return !isPlayer ? handlePlayerSit(seat) : handlePlayerLeaveSeat(seat);
  };

  const seatToPlayer = useMemo(() => {
    const map = new Map<number, PlayerData>();
    for (const player of gameState.players) {
      map.set(player.seat, player);
    }
    return map;
  }, [gameState.players]);

  return (
    <Container>
      <p>Current User: {user?.username}</p>

      <p>Users: {baseAppState.users.length}</p>

      {Array.from({ length: totalSeats }).map((_, seat) => {
        const player = seatToPlayer.get(seat);
        const isCurrentPlayer = player?.name === user?.username;

        return (
          <p key={seat}>
            Seat {seat + 1}: {player?.name ?? 'Empty'}
            {(!player || isCurrentPlayer) && (
              <Button onClick={() => handleSitOrLeave(seat, !!player)}>
                {isCurrentPlayer ? 'leave' : 'sit'}
              </Button>
            )}
          </p>
        );
      })}
    </Container>
  );
};
