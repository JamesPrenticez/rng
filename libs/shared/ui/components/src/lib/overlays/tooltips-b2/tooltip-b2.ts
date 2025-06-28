import { TooltipSide, useNotificationStore } from "./notification-b2.store";

export const tooltipsb2 = {
atElement: (
    message: string,
    element: HTMLElement,
    side: TooltipSide = 'top',
    duration = 1000,
    offset = 8,
    hasArrow = true
) => {
    const rect = element.getBoundingClientRect();
    // Pass the center of the element, let the hook handle offset
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    useNotificationStore.getState().createTooltip({
        type: 'element',
        message,
        position: { x, y },
        duration,
        side,
        hasArrow,
        elementRect: rect // Pass the element rect for better positioning
    });
},
    atMouse: (
      message: string,
      side: TooltipSide = 'top',
      offset = 8,
      duration = 1000,
      hasArrow = false
    ) => {
        useNotificationStore.getState().createTooltip({
            type: 'mouse',
            message,
            duration,
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
};
