import { create } from 'zustand';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipData {
    type: 'element' | 'mouse' | 'absolute';
    message: string;
    position?: {
        x: number | string;
        y: number | string;
    };
    side?: TooltipSide;
    offset?: number;
    duration: number;
    hasArrow?: boolean;
    elementRect?: DOMRect;
}

interface NotificationState {
  tooltip: TooltipData | null;
  createTooltip: (data: Omit<TooltipData, 'id'>) => void;
  clearTooltip: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    tooltip: null,
    createTooltip: (tooltip) => { set({ tooltip }) },
    clearTooltip: () => set({ tooltip: null }),
}));
