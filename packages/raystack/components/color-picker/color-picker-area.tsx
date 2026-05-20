'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import styles from './color-picker.module.css';
import { useColorPicker } from './color-picker-root';
import { getColorString } from './utils';

export type ColorPickerAreaProps = ComponentProps<'div'>;

export const ColorPickerArea = ({
  className,
  ...props
}: ColorPickerAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isThumbVisible = useRef(false);

  const { hue, saturation, lightness, setColor } = useColorPicker();
  const thumbColor = getColorString(
    { h: hue, s: saturation, l: lightness, alpha: 1 },
    'hex'
  );

  const backgroundGradient = useMemo(() => {
    return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;
  }, [hue]);

  // Need to use useEffect as color can change from outside, and we need to sync thumb position
  useEffect(() => {
    if (!containerRef.current || !thumbRef.current) return;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const x = clamp(saturation / 100);
    const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
    const y = clamp(1 - lightness / topLightness);

    thumbRef.current.style.left = `${x * 100}%`;
    thumbRef.current.style.top = `${y * 100}%`;

    // This is needed to avoid flickering of the thumb on initial render
    if (!isThumbVisible.current) {
      isThumbVisible.current = true;
      thumbRef.current.style.opacity = '1';
    }
  }, [saturation, lightness]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging.current && containerRef.current && thumbRef.current)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      );
      const saturation = x * 100;
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
      const lightness = topLightness * (1 - y);
      setColor({ s: saturation, l: lightness });
    },
    [setColor]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDragging.current = true;
      handlePointerMove(e.nativeEvent);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [handlePointerMove, handlePointerUp]
  );

  return (
    <div
      className={cx(styles.selectionRoot, className)}
      onPointerDown={handlePointerDown}
      ref={containerRef}
      style={{
        background: backgroundGradient
      }}
      {...props}
    >
      <div
        className={cx(styles.sliderThumb, styles.selectionThumb)}
        ref={thumbRef}
        style={{
          background: thumbColor,
          opacity: 0
        }}
      />
    </div>
  );
};

ColorPickerArea.displayName = 'ColorPicker.Area';
