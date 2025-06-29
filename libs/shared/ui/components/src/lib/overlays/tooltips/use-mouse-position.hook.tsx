import { useEffect, useRef } from 'react';

export const useMousePosition = () => {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const listener = (event: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mousePosition.current = { x: event.clientX, y: event.clientY };
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('mousemove', listener);
    return () => document.removeEventListener('mousemove', listener);
  }, []);

  return mousePosition;
}
