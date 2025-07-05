import { Middleware, Placement } from "./use-floating.hook";

// Helper function to get opposite placement
function getOppositePlacement(placement: Placement): Placement {
  const [side, alignment] = placement.split('-') as [string, string?];
  
  const oppositeSides: Record<string, string> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  };
  
  const oppositeSide = oppositeSides[side] || side;
  return alignment ? `${oppositeSide}-${alignment}` as Placement : oppositeSide as Placement;
}

// Helper function to calculate position for a given placement
function calculatePositionForPlacement(
  placement: Placement,
  reference: DOMRect,
  floating: DOMRect
): { x: number; y: number } {
  const [side, alignment] = placement.split('-') as [string, string?];
  
  let x = reference.left;
  let y = reference.top;

  // Position based on side
  switch (side) {
    case 'top':
      x = reference.left + reference.width / 2 - floating.width / 2;
      y = reference.top - floating.height;
      break;
    case 'bottom':
      x = reference.left + reference.width / 2 - floating.width / 2;
      y = reference.bottom;
      break;
    case 'left':
      x = reference.left - floating.width;
      y = reference.top + reference.height / 2 - floating.height / 2;
      break;
    case 'right':
      x = reference.right;
      y = reference.top + reference.height / 2 - floating.height / 2;
      break;
  }

  // Adjust for alignment
  if (alignment) {
    switch (side) {
      case 'top':
      case 'bottom':
        if (alignment === 'start') {
          x = reference.left;
        } else if (alignment === 'end') {
          x = reference.right - floating.width;
        }
        break;
      case 'left':
      case 'right':
        if (alignment === 'start') {
          y = reference.top;
        } else if (alignment === 'end') {
          y = reference.bottom - floating.height;
        }
        break;
    }
  }

  return { x, y };
}

// Helper function to check if floating element fits within boundary
function checkFit(
  x: number,
  y: number,
  floating: DOMRect,
  boundary: DOMRect,
  padding: 0
): boolean {
  return (
    x >= boundary.left + padding &&
    y >= boundary.top + padding &&
    x + floating.width <= boundary.right - padding &&
    y + floating.height <= boundary.bottom - padding
  );
}

export function flip({
  boundary,
  fallbackPlacements,
  padding = 0,
}: { 
  boundary?: Element[]; 
  fallbackPlacements?: Placement[];
  padding?: number;
} = {}): Middleware {
  return {
    name: 'flip',
    fn: ({ x, y, placement, reference, floating, boundary: docBoundary }) => {
      const b = boundary && boundary.length > 0 
        ? boundary[0].getBoundingClientRect() 
        : docBoundary;

      // If current placement fits, don't flip
      if (checkFit(x, y, floating, b, 0)) {
        return;
      }

      // Default fallback placements if none provided
      const defaultFallbacks: Placement[] = [
        getOppositePlacement(placement),
        ...(['top', 'bottom', 'right', 'left'] as Placement[]).filter(p => p !== placement)
      ];

      const placements = fallbackPlacements || defaultFallbacks;

      // Try each fallback placement
      for (const newPlacement of placements) {
        const { x: trialX, y: trialY } = calculatePositionForPlacement(
          newPlacement,
          reference,
          floating
        );

        if (checkFit(trialX, trialY, floating, b, 0)) {
          return { 
            x: trialX, 
            y: trialY, 
            placement: newPlacement,
            middlewareData: { flipped: true }
          };
        }
      }

      // If no placement fits, try to find the best fit
      let bestPlacement = placement;
      let bestX = x;
      let bestY = y;
      let bestOverflow = Infinity;

      for (const testPlacement of [placement, ...placements]) {
        const { x: testX, y: testY } = calculatePositionForPlacement(
          testPlacement,
          reference,
          floating
        );

        // Calculate total overflow
        const leftOverflow = Math.max(0, b.left + padding - testX);
        const rightOverflow = Math.max(0, testX + floating.width - (b.right - padding));
        const topOverflow = Math.max(0, b.top + padding - testY);
        const bottomOverflow = Math.max(0, testY + floating.height - (b.bottom - padding));
        
        const totalOverflow = leftOverflow + rightOverflow + topOverflow + bottomOverflow;

        if (totalOverflow < bestOverflow) {
          bestOverflow = totalOverflow;
          bestPlacement = testPlacement;
          bestX = testX;
          bestY = testY;
        }
      }

      return { 
        x: bestX, 
        y: bestY, 
        placement: bestPlacement,
        middlewareData: { flipped: bestPlacement !== placement }
      };
    },
  };
}