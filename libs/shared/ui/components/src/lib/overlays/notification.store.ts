import { create } from 'zustand';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipData {
  message: string;
  side: TooltipSide;
  duration: number;
  reference: HTMLElement;
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
