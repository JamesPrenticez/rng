import { create } from 'zustand';

type Position = [number, number, number];

type PositioningStore = {
  seatPositions: Position[];
};

export const usePositioningStore = create<PositioningStore>(() => {
  const numberOfSeats = 4;
  const radius = 12;
  const initialPositions: Position[] = Array.from(
    { length: numberOfSeats },
    (_, i) => {
      const angle = (i / numberOfSeats) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return [x, -0.1, z];
    }
  );

  return {
    seatPositions: initialPositions,
  };
});
