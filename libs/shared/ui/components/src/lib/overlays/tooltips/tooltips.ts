import { Placement, VirtualElement } from '@floating-ui/react-dom';
import { TooltipSide, useTooltipStore } from '../notification.store';

export const tooltips = {
  atElement: (
    message: string,
    reference: HTMLElement,
    side: Placement = 'top',
    duration = 1500,
    withArrow = true
  ) => {
    useTooltipStore.getState().createTooltip({
      type: 'element',
      message,
      side,
      duration,
      reference,
      withArrow
    });
  },
  atMouse: (
    message: string,
    event: React.MouseEvent,
    side: TooltipSide = 'top',
    duration = 1500,
    withArrow = false
  ) => {
    const { clientX: x, clientY: y } = event;
    const virtualRef = createVirtualReference(x, y);

    useTooltipStore.getState().createTooltip({
      type: 'mouse',
      message,
      side,
      duration,
      reference: virtualRef,
      coords: { x, y },
      withArrow
    });
  },

  atAbsolute: (
    message: string,
    side: TooltipSide = 'top',
    duration = 1500,
    coords: { x: number, y: number },
    withArrow = false
  ) => {
    const virtualRef = createVirtualReference(coords.x, coords.y);

    useTooltipStore.getState().createTooltip({
      type: 'absolute',
      message,
      side,
      duration,
      reference: virtualRef,
      coords: { x: coords.x, y: coords.y },
      withArrow
    });
  },
};

const createVirtualReference = (x: number, y: number): VirtualElement => ({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    top: y,
    bottom: y,
    left: x,
    right: x,
    x,
    y,
    toJSON: () => null,
  }),
});
