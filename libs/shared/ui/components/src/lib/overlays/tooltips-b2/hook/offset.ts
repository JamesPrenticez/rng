import { Middleware } from "./use-floating.hook";

export function offset(value: number): Middleware {
  return {
    name: 'offset',
    fn: ({ x, y, placement }) => {
      if (placement.startsWith('top')) return { y: y - value };
      if (placement.startsWith('bottom')) return { y: y + value };
      if (placement.startsWith('left')) return { x: x - value };
      if (placement.startsWith('right')) return { x: x + value };
    },
  };
}