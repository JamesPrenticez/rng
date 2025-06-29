import { useEffect, useRef, useState } from 'react';
import { TooltipData } from './notification.store';

export const useTooltipVisibility = (tooltipData: TooltipData | null) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (tooltipData) {
      setShouldRender(true);
      setVisible(true);

      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        timeoutRef.current = setTimeout(() => {
          setShouldRender(false);
        }, 200); // match fade-out CSS
      }, tooltipData.duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tooltipData]);

  return { shouldRender, visible };
}
