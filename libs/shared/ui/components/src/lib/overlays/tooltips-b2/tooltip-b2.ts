import { Placement, VirtualElement } from '@floating-ui/react-dom';
import { TooltipSide, useTooltipStore } from './notification.store';
import { createVirtualReference } from './create-virtual-reference.util';

export const tooltipsb2 = {
  atElement: (
    message: string,
    reference: HTMLElement,
    side: Placement = 'top',
    duration = 1500,
    withArrow = true
  ) => {
    const virtualRef = fromElement(reference);

    useTooltipStore.getState().createTooltip({
      type: 'element',
      message,
      side,
      duration,
      reference: virtualRef,
      withArrow,
    });
  },
  atMouse: (
    message: string,
    side: TooltipSide = 'top',
    duration = 1500,
    // coords: { x: number; y: number },
    withArrow = false
  ) => {
   // Create a placeholder virtual reference - actual position will be set in renderer
    const virtualRef = createVirtualReference(0, 0);

    useTooltipStore.getState().createTooltip({
      type: 'mouse',
      message,
      side,
      duration,
      reference: virtualRef,
      withArrow,
    });
  },
  atMouseEvent: (
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
      withArrow,
    });
  },
  atAbsolute: (
    message: string,
    side: TooltipSide = 'top',
    duration = 1500,
    coords: { x: number; y: number },
    withArrow = false
  ) => {
    const virtualRef = createVirtualReference(coords.x, coords.y);

    useTooltipStore.getState().createTooltip({
      type: 'absolute',
      message,
      side,
      duration,
      reference: virtualRef,
      withArrow,
    });
  },
};



// Wraps a Natural DOM element bounding box into a VirtualElement
// Floating UI fails to update position when switching from HTMLElement to VirtualElement
// Its a annoying bug and this is a work around...
// You would think adding a tooltip.id would force a re-compte but it doesn't
// const fromElement = (el: HTMLElement): VirtualElement => ({
//   getBoundingClientRect: () => {
//     const rect = el.getBoundingClientRect();
//     return {
//       width: rect.width,
//       height: rect.height,
//       top: rect.top,
//       bottom: rect.bottom,
//       left: rect.left,
//       right: rect.right,
//       x: rect.left,
//       y: rect.top,
//       toJSON: () => null,
//     };
//   },
// });


const memo = new WeakMap<HTMLElement, VirtualElement>();

const fromElement = (el: HTMLElement): VirtualElement => {
  if (memo.has(el)) return memo.get(el)!;

  const virtualRef: VirtualElement = {
    getBoundingClientRect: () => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        x: rect.left,
        y: rect.top,
        toJSON: () => null,
      };
    },
  };

  memo.set(el, virtualRef);
  return virtualRef;
};