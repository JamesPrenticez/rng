import { TooltipSide, useNotificationStore } from "./notification-b4.store";

export const tooltipsb4 = {
    atElement: (
        message: string,
        element: HTMLElement,
        side: TooltipSide = 'top',
        duration = 1000,
        offset = 8, // px space between element and tooltip
        hasArrow = true
    ) => {
        const rect = element.getBoundingClientRect();
        let x: number | string = 0;
        let y: number | string = 0;

        switch (side) {
            case 'top':
                x = rect.left + rect.width / 2;
                y = rect.top - offset;
                break;
            case 'bottom':
                x = rect.left + rect.width / 2;
                y = rect.bottom + offset;
                break;
            case 'left':
                x = rect.left - offset;
                y = rect.top + rect.height / 2;
                break;
            case 'right':
                x = rect.right + offset;
                y = rect.top + rect.height / 2;
                break;
        }

        useNotificationStore.getState().createTooltip({
            type: 'absolute',
            message,
            position: { x, y },
            duration,
            side,
            hasArrow,
        });
    },
    atAbsolute: (
        message: string,
        x: number | string,
        y: number | string,
        duration = 1000
    ) => {
        useNotificationStore.getState().createTooltip({
            type: 'absolute',
            message,
            position: { x, y },
            duration,
        });
    },
    atMouse: (message: string, duration = 1000, hasArrow = false) => {
        useNotificationStore.getState().createTooltip({
            type: 'mouse',
            message,
            duration,
            hasArrow,
        });
    },
};
