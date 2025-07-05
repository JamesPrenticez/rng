import { VirtualElement } from "@floating-ui/react-dom";

export const createVirtualReference = (x: number, y: number): VirtualElement => ({
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