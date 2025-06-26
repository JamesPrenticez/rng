import { TooltipSide, useTooltipStore } from "../notification.store";

export const tooltips = {
  withFloating: (
    message: string,
    reference: HTMLElement,
    side: TooltipSide = 'top',
    duration = 1500
  ) => {
    useTooltipStore.getState().createTooltip({
      message,
      side,
      duration,
      reference,
    });
  },
};
