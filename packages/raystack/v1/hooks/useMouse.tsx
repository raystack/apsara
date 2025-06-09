import { useCallback, useEffect, useRef, useState } from 'react';

type PositionType = {
  x: number;
  y: number;
};
type SizeType = {
  width: number;
  height: number;
};
type UseMouseValue = PositionType & SizeType;

type UseMouseOptions = {
  resetOnExit?: boolean;
  enabled?: boolean;
};

export function useMouse<T extends HTMLElement = HTMLElement>(
  options: UseMouseOptions = {}
) {
  const { resetOnExit = false, enabled = true } = options;
  const [value, setValue] = useState<UseMouseValue | null>(null);
  const elementRef = useRef<T | null>(null);

  // Handle mouse movement using native MouseEvent
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      const element = elementRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        // Calculate coordinates relative to the element
        const x = Math.max(0, Math.round(event.clientX - rect.left));
        const y = Math.max(0, Math.round(event.clientY - rect.top));
        setValue({ x, y, width: rect.width, height: rect.height });
      } else {
        setValue({
          x: event.clientX,
          y: event.clientY,
          width: 0,
          height: 0
        });
      }
    },
    [enabled]
  );

  const reset = useCallback(() => {
    setValue(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // If no element is provided, default to document for global tracking
    const target: HTMLElement | Document = elementRef.current || document;

    target.addEventListener('mousemove', handleMouseMove as EventListener);
    if (resetOnExit) {
      target.addEventListener('mouseleave', reset);
    }

    return () => {
      target.removeEventListener('mousemove', handleMouseMove as EventListener);
      if (resetOnExit) {
        target.removeEventListener('mouseleave', reset);
      }
    };
  }, [enabled, handleMouseMove, reset, resetOnExit]);

  return { ref: elementRef, value, reset };
}
