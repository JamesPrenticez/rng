import { create } from 'zustand';

import type { ITooltip } from './tooltips';

interface TooltipState {
    tooltip: ITooltip | null;
    createTooltip: (tooltip: ITooltip) => void;
    clearTooltip: () => void;
}

export type NotificationState = TooltipState;

export const useNotificationStore = create<NotificationState>((set) => ({
    tooltip: null,
    createTooltip: (tooltip) => {
        set({ tooltip: null }); 
        queueMicrotask(() => set({ tooltip })); // before showing a new one
    },
    clearTooltip: () => set({ tooltip: null }),
}));
