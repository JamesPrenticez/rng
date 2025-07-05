import { Placement, VirtualElement } from '@floating-ui/react-dom';
import { create } from 'zustand';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipData {
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
  createTooltip: (tooltip) => { set({ tooltip }) },
  clearTooltip: () => set({ tooltip: null }),
}));
