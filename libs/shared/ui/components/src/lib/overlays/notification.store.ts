import { Placement, VirtualElement } from '@floating-ui/react-dom';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipData {
  id: string;
  type: 'element' | 'mouse' | 'absolute'
  message: string;
  side: Placement;
  duration: number;
  reference: HTMLElement | VirtualElement;
  coords?: { x: number; y: number };
  withArrow?: boolean;
}

interface TooltipStore {
  tooltip: TooltipData | null;
  createTooltip: (data: Omit<TooltipData, 'id'>) => void;
  clearTooltip: () => void;
}

export const useTooltipStore = create<TooltipStore>((set) => ({
  tooltip: null,
createTooltip: (data) =>
  set((state) => {
    const prev = state.tooltip;
    if (
      prev?.message === data.message &&
      prev?.reference === data.reference &&
      prev?.side === data.side
    ) {
      return state; // no update
    }

    return {
      tooltip: {
        ...data,
        id: uuidv4(),
      },
    };
  }),
  clearTooltip: () => set({ tooltip: null }),
}));
