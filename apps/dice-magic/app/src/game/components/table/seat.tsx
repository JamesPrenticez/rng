import { usePlayersBySeat } from '@dice-magic/hooks';
import styled from '@emotion/styled';
import { Html } from '@react-three/drei';
import { cssVarTo3jsColor } from '@dice-magic/utils';
import { useUserStore } from '@shared/stores';

interface SeatProps {
  seatNum: number;
  position: [number, number, number];
}

const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .seat-number {
    white-space: nowrap;
    font-size: 2rem;
    font-weight: 400;
    color: var(--color-text-subtle);
  }

  .player-name {
    font-weight: 500;
    font-size: 3rem;
    color: var(--color-primary);
  }
`;

export const Seat = ({ seatNum, position }: SeatProps) => {
  const seatColor = cssVarTo3jsColor('var(--color-action-hover)');
  const seatToPlayer = usePlayersBySeat();
  const playerName = seatToPlayer.get(seatNum)?.name;
  const user = useUserStore((s) => s.user);

  return (
    <group position={position}>
      <mesh receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 64]} />
        <meshStandardMaterial color={seatColor} />
      </mesh>

      {playerName !== user?.name && (
        <Html
          center
          distanceFactor={10} // controls scale vs camera distance
          position={[0, 3, 0]} // put above seat
          occlude // hide behind gemoerty / camera
        >
          <SeatContainer>
            <div className="player-name">{playerName}</div>
            <div className="seat-number">Player: {seatNum + 1}</div>
          </SeatContainer>
        </Html>
      )}
    </group>
  );
};
