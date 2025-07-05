import { useLayoutEffect, useRef, useState, useCallback } from 'react';

// Types
type Side = 'top' | 'bottom' | 'left' | 'right';
export type Placement = Side | `${Side}-start` | `${Side}-end`;

interface MiddlewareState {
  x: number;
  y: number;
  placement: Placement;
  middlewareData: Record<string, any>;
}

export type MiddlewareFn = (
  args: MiddlewareState & {
    reference: DOMRect;
    floating: DOMRect;
    boundary: DOMRect;
  }
) => Partial<MiddlewareState> | void;

export type Middleware = { name: string; fn: MiddlewareFn };

// Virtual element type for custom positioning
export interface VirtualElement {
  getBoundingClientRect(): DOMRect;
}

type ReferenceElement = Element | VirtualElement;

// Helper function to get position based on placement
function getPositionFromPlacement(
  placement: Placement,
  refRect: DOMRect,
  floatRect: DOMRect
): { x: number; y: number } {
  let x = refRect.left;
  let y = refRect.top;

  const [side, alignment] = placement.split('-') as [Side, string?];

  // Position based on side
  switch (side) {
    case 'top':
      x = refRect.left + refRect.width / 2 - floatRect.width / 2;
      y = refRect.top - floatRect.height;
      break;
    case 'bottom':
      x = refRect.left + refRect.width / 2 - floatRect.width / 2;
      y = refRect.bottom;
      break;
    case 'left':
      x = refRect.left - floatRect.width;
      y = refRect.top + refRect.height / 2 - floatRect.height / 2;
      break;
    case 'right':
      x = refRect.right;
      y = refRect.top + refRect.height / 2 - floatRect.height / 2;
      break;
  }

  // Adjust for alignment
  if (alignment) {
    switch (side) {
      case 'top':
      case 'bottom':
        if (alignment === 'start') {
          x = refRect.left;
        } else if (alignment === 'end') {
          x = refRect.right - floatRect.width;
        }
        break;
      case 'left':
      case 'right':
        if (alignment === 'start') {
          y = refRect.top;
        } else if (alignment === 'end') {
          y = refRect.bottom - floatRect.height;
        }
        break;
    }
  }

  return { x, y };
}

// --- Hook ---
export function useFloating({
  placement = 'top',
  middleware = [],
  whileElementsMounted,
}: {
  placement?: Placement;
  middleware?: Middleware[];
  whileElementsMounted?: (
    reference: ReferenceElement,
    floating: HTMLElement,
    update: () => void
  ) => void | (() => void);
} = {}) {
  const reference = useRef<ReferenceElement | null>(null);
  const floating = useRef<HTMLElement | null>(null);

  const [state, setState] = useState<MiddlewareState>({
    x: 0,
    y: 0,
    placement,
    middlewareData: {},
  });

  const update = useCallback(() => {
    if (!reference.current || !floating.current) return;
    
    const refRect = reference.current.getBoundingClientRect();
    const floatRect = floating.current.getBoundingClientRect();
    const boundary = document.documentElement.getBoundingClientRect();

    // Get initial position based on placement
    const { x, y } = getPositionFromPlacement(placement, refRect, floatRect);

    let next: MiddlewareState = { x, y, placement, middlewareData: {} };

    // Apply middleware in order
    for (const m of middleware) {
      const result = m.fn({
        ...next,
        reference: refRect,
        floating: floatRect,
        boundary,
      });
      
      if (result) {
        if (result.x !== undefined) next.x = result.x;
        if (result.y !== undefined) next.y = result.y;
        if (result.placement) next.placement = result.placement;
        if (result.middlewareData) {
          next.middlewareData = {
            ...next.middlewareData,
            [m.name]: result.middlewareData,
          };
        }
      }
    }

    setState(prev => {
      // Only update if values actually changed to prevent unnecessary re-renders
      if (
        prev.x === next.x &&
        prev.y === next.y &&
        prev.placement === next.placement &&
        JSON.stringify(prev.middlewareData) === JSON.stringify(next.middlewareData)
      ) {
        return prev;
      }
      return next;
    });
  }, [placement, middleware]);

  useLayoutEffect(() => {
    if (!reference.current || !floating.current) return;

    let cleanup: void | (() => void) = undefined;

    if (whileElementsMounted) {
      cleanup = whileElementsMounted(
        reference.current,
        floating.current,
        update
      );
    } else {
      // Call update immediately for initial positioning
      update();
    }

    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [update, whileElementsMounted]);

  const refs = {
    setReference: useCallback((node: ReferenceElement | null) => {
      if (reference.current === node) return;
      reference.current = node;
      // Trigger update when reference changes
      if (node && floating.current) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(update, 0);
      }
    }, [update]),
    
    setFloating: useCallback((node: HTMLElement | null) => {
      if (floating.current === node) return;
      floating.current = node;
      // Trigger update when floating changes
      if (node && reference.current) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(update, 0);
      }
    }, [update]),
  };

  const floatingStyles = {
    position: 'absolute' as const,
    top: state.y,
    left: state.x,
  };

  return {
    refs,
    floatingStyles,
    placement: state.placement,
    middlewareData: state.middlewareData,
    strategy: 'absolute' as const,
    update,
  };
}