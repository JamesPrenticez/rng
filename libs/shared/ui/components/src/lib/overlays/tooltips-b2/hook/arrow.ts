import { Middleware } from "./use-floating.hook";

export function arrow({ 
  element,
  padding = 0 
}: { 
  element: React.RefObject<HTMLElement> | HTMLElement | null;
  padding?: number;
}): Middleware {
  return {
    name: 'arrow',
    fn: ({ reference, floating, placement }) => {
      // Get the arrow element
      let arrowEl: HTMLElement | null = null;
      
      if (element) {
        if ('current' in element) {
          arrowEl = element.current;
        } else {
          arrowEl = element;
        }
      }

      if (!arrowEl) {
        return { middlewareData: {} };
      }

      const arrowRect = arrowEl.getBoundingClientRect();
      const [side, alignment] = placement.split('-') as [string, string?];

      let x: number | undefined;
      let y: number | undefined;

      // Calculate arrow position based on placement
      switch (side) {
        case 'top':
        case 'bottom':
          // Arrow positioned horizontally along the reference element
          { x = reference.left + reference.width / 2 - floating.left - arrowRect.width / 2;
          
          // Constrain arrow within floating element bounds with padding
          const minX = padding;
          const maxX = floating.width - arrowRect.width - padding;
          x = Math.max(minX, Math.min(x, maxX));
          
          // For alignment adjustments
          if (alignment === 'start') {
            x = Math.max(minX, reference.left - floating.left + arrowRect.width / 2);
          } else if (alignment === 'end') {
            x = Math.min(maxX, reference.right - floating.left - arrowRect.width / 2 - arrowRect.width);
          }
          break; }

        case 'left':
        case 'right':
          // Arrow positioned vertically along the reference element
          { y = reference.top + reference.height / 2 - floating.top - arrowRect.height / 2;
          
          // Constrain arrow within floating element bounds with padding
          const minY = padding;
          const maxY = floating.height - arrowRect.height - padding;
          y = Math.max(minY, Math.min(y, maxY));
          
          // For alignment adjustments
          if (alignment === 'start') {
            y = Math.max(minY, reference.top - floating.top + arrowRect.height / 2);
          } else if (alignment === 'end') {
            y = Math.min(maxY, reference.bottom - floating.top - arrowRect.height / 2 - arrowRect.height);
          }
          break; }
      }

      return {
        middlewareData: {
          x,
          y,
          centerOffset: 0, // Could be calculated if needed
        }
      };
    },
  };
}