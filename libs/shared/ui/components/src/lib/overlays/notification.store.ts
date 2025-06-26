import { Placement, VirtualElement } from '@floating-ui/react-dom';
import { create } from 'zustand';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipData {
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
  createTooltip: (data: TooltipData) => void;
  clearTooltip: () => void;
}

export const useTooltipStore = create<TooltipStore>((set) => ({
  tooltip: null,
  createTooltip: (data) => {
    set({ tooltip: data });
    setTimeout(() => set({ tooltip: null }), data.duration);
  },
  clearTooltip: () => set({ tooltip: null }),
}));
