import { Placement, VirtualElement } from '@floating-ui/react-dom';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipData {
    type: 'mouse' | 'absolute';
    message: string;
    position?: {
        x: number | string;
        y: number | string;
    };
    side?: TooltipSide;
    offset?: number;
    duration: number;
    hasArrow?: boolean;
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
