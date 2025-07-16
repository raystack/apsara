'use client';
import { cx } from 'class-variance-authority';
import Color from 'color';
import {
  type HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  memo,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { useColorPicker } from './color-picker-base';
import styles from './color-picker.module.css';

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(
  ({ className, ...props }: ColorPickerSelectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const { hue, saturation, lightness, alpha, setSaturation, setLightness } =
      useColorPicker();
    const color = Color.hsl(hue, saturation, lightness, alpha / 100);

    const backgroundGradient = useMemo(() => {
      return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;
    }, [hue]);

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

        thumbRef.current.style.left = `${x * 100}%`;
        thumbRef.current.style.top = `${y * 100}%`;
        setSaturation(x * 100);
        const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
        const lightness = topLightness * (1 - y);
        setLightness(lightness);
      },
      [setSaturation, setLightness]
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
          className={styles.selectionThumb}
          ref={thumbRef}
          style={{ background: color.hex().toString() }}
        />
      </div>
    );
  }
);
