import { create } from 'zustand';

type Position = [number, number, number];

type PosittioningStore = {
  seatPositions: Position[];
  generatePositions: (num: number) => void;
};

export const usePositioningStore = create<PosittioningStore>((set) => ({
  seatPositions: [],
  generatePositions: (numOfSeats) => {
    const radius = 12;
    const seatPositions = Array.from({ length: numOfSeats }, (_, i) => {
      const angle = (i / numOfSeats) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return [x, -0.1, z] as Position;
    });

    set({ seatPositions });
  },
}));