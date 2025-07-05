import { VirtualElement } from "./use-floating.hook";

type ReferenceElement = Element | VirtualElement;

export function autoUpdate(
  reference: ReferenceElement | null,
  floating: HTMLElement | null,
  update: () => void
): (() => void) | undefined {
  // Guard against null/undefined elements
  if (!reference || !floating) {
    console.warn('autoUpdate: reference or floating element is null/undefined');
    return undefined;
  }

  // Additional type check for floating element
  if (!(floating instanceof HTMLElement)) {
    console.warn('autoUpdate: floating element is not an HTMLElement');
    return undefined;
  }

  // Check if reference is a virtual element or DOM element
  const isVirtualElement = !('nodeType' in reference);
  
  if (!isVirtualElement && !(reference instanceof Element)) {
    console.warn('autoUpdate: reference is not a valid Element or VirtualElement');
    return undefined;
  }

  const cleanupFunctions: Array<() => void> = [];

  try {
    // Set up ResizeObserver for DOM elements
    if (!isVirtualElement) {
      const observer = new ResizeObserver(() => {
        update();
      });
      
      observer.observe(reference as Element);
      observer.observe(floating);
      
      cleanupFunctions.push(() => observer.disconnect());
    }

    // Set up scroll listeners
    const scrollHandler = () => {
      update();
    };

    // Listen to scroll events on window and all scrollable ancestors
    window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });
    cleanupFunctions.push(() => {
      window.removeEventListener('scroll', scrollHandler, { capture: true });
    });

    // Set up resize listener
    const resizeHandler = () => {
      update();
    };

    window.addEventListener('resize', resizeHandler, { passive: true });
    cleanupFunctions.push(() => {
      window.removeEventListener('resize', resizeHandler);
    });

    // Set up animation frame updates for virtual elements
    let animationFrameId: number | null = null;
    
    if (isVirtualElement) {
      const virtualUpdate = () => {
        update();
        animationFrameId = requestAnimationFrame(virtualUpdate);
      };
      animationFrameId = requestAnimationFrame(virtualUpdate);
      
      cleanupFunctions.push(() => {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
      });
    }

    // Call update initially
    update();

  } catch (error) {
    console.error('Failed to set up auto-update:', error);
    // Clean up any partial setup
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    });
    return undefined;
  }

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('Error during auto-update cleanup:', error);
      }
    });
  };
}