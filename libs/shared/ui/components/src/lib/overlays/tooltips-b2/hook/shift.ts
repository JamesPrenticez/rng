import { Middleware } from "./use-floating.hook";

export function shift({ 
  boundary, 
  padding = 0,
  crossAxis = true,
  mainAxis = true 
}: { 
  boundary?: Element[]; 
  padding?: number;
  crossAxis?: boolean;
  mainAxis?: boolean;
} = {}): Middleware {
  return {
    name: 'shift',
    fn: ({ x, y, floating, boundary: docBoundary, placement }) => {
      const b = boundary && boundary.length > 0 
        ? boundary[0].getBoundingClientRect() 
        : docBoundary;

      let newX = x;
      let newY = y;

      const [side] = placement.split('-');

      // Apply main axis shifting (along the direction of the placement)
      if (mainAxis) {
        if (side === 'top' || side === 'bottom') {
          // For top/bottom placements, main axis is horizontal
          const leftOverflow = b.left + padding - x;
          const rightOverflow = x + floating.width - (b.right - padding);
          
          if (leftOverflow > 0) {
            newX = x + leftOverflow;
          } else if (rightOverflow > 0) {
            newX = x - rightOverflow;
          }
        } else {
          // For left/right placements, main axis is vertical
          const topOverflow = b.top + padding - y;
          const bottomOverflow = y + floating.height - (b.bottom - padding);
          
          if (topOverflow > 0) {
            newY = y + topOverflow;
          } else if (bottomOverflow > 0) {
            newY = y - bottomOverflow;
          }
        }
      }

      // Apply cross axis shifting (perpendicular to the placement direction)
      if (crossAxis) {
        if (side === 'left' || side === 'right') {
          // For left/right placements, cross axis is horizontal
          const leftOverflow = b.left + padding - newX;
          const rightOverflow = newX + floating.width - (b.right - padding);
          
          if (leftOverflow > 0) {
            newX = newX + leftOverflow;
          } else if (rightOverflow > 0) {
            newX = newX - rightOverflow;
          }
        } else {
          // For top/bottom placements, cross axis is vertical
          const topOverflow = b.top + padding - newY;
          const bottomOverflow = newY + floating.height - (b.bottom - padding);
          
          if (topOverflow > 0) {
            newY = newY + topOverflow;
          } else if (bottomOverflow > 0) {
            newY = newY - bottomOverflow;
          }
        }
      }

      // Ensure the element stays within bounds with padding
      newX = Math.max(b.left + padding, Math.min(newX, b.right - floating.width - padding));
      newY = Math.max(b.top + padding, Math.min(newY, b.bottom - floating.height - padding));

      return { x: newX, y: newY };
    },
  };
}