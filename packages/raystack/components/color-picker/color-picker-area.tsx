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
import {
  CHROMA_MAX,
  clamp01,
  getColorString,
  hslToOklch,
  oklchToHsl,
  oklchToRgb
} from './utils';

// Internal pixel resolution for the C × L plane. CSS upscales this to the
// container size; a 96² grid is the sweet spot between a smooth gradient and
// keeping the per-hue repaint comfortably inside one frame.
const CANVAS_RES = 96;

export type ColorPickerAreaProps = ComponentProps<'div'>;

export const ColorPickerArea = (props: ColorPickerAreaProps) => {
  const { mode } = useColorPicker();
  return mode === 'oklch' ? <OklchArea {...props} /> : <HslArea {...props} />;
};

ColorPickerArea.displayName = 'ColorPicker.Area';

// OKLCH mode: chroma × lightness plane covering the full P3 gamut. Channels
// outside sRGB are channel-clipped for display; the input remains true OKLCH.
const OklchArea = ({ className, ...props }: ColorPickerAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isThumbVisible = useRef(false);

  const { lightness, chroma, hue, setColor } = useColorPicker();
  const thumbColor = getColorString(
    { l: lightness, c: chroma, h: hue, alpha: 1 },
    'hex'
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = ctx.createImageData(CANVAS_RES, CANVAS_RES);
    for (let y = 0; y < CANVAS_RES; y++) {
      const L = 1 - y / (CANVAS_RES - 1);
      for (let x = 0; x < CANVAS_RES; x++) {
        const C = (x / (CANVAS_RES - 1)) * CHROMA_MAX;
        const rgb = oklchToRgb(L, C, hue);
        const idx = (y * CANVAS_RES + x) * 4;
        if (!rgb) {
          img.data[idx] = img.data[idx + 1] = img.data[idx + 2] = 128;
          img.data[idx + 3] = 255;
          continue;
        }
        img.data[idx] = Math.round(clamp01(rgb.r) * 255);
        img.data[idx + 1] = Math.round(clamp01(rgb.g) * 255);
        img.data[idx + 2] = Math.round(clamp01(rgb.b) * 255);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [hue]);

  useEffect(() => {
    if (!thumbRef.current) return;
    const x = clamp01(chroma / CHROMA_MAX);
    const y = clamp01(1 - lightness);
    thumbRef.current.style.left = `${x * 100}%`;
    thumbRef.current.style.top = `${y * 100}%`;
    if (!isThumbVisible.current) {
      isThumbVisible.current = true;
      thumbRef.current.style.opacity = '1';
    }
  }, [lightness, chroma]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging.current && containerRef.current)) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      setColor({ c: x * CHROMA_MAX, l: 1 - y });
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
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_RES}
        height={CANVAS_RES}
        className={styles.selectionCanvas}
      />
      <div
        className={cx(styles.sliderThumb, styles.selectionThumb)}
        ref={thumbRef}
        style={{ background: thumbColor, opacity: 0 }}
      />
    </div>
  );
};

// Non-OKLCH modes: classic HSL saturation × scaled-lightness square (pre-OKLCH
// behavior). State is still stored as OKLCH; we derive HSL for display and
// convert back on edit so the rest of the picker keeps a single source of
// truth.
const HslArea = ({ className, ...props }: ColorPickerAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isThumbVisible = useRef(false);

  const { lightness, chroma, hue, setColor } = useColorPicker();
  const hsl = useMemo(
    () => oklchToHsl({ l: lightness, c: chroma, h: hue }),
    [lightness, chroma, hue]
  );

  const background = useMemo(
    () =>
      `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
       linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
       hsl(${hsl.h}, 100%, 50%)`,
    [hsl.h]
  );

  useEffect(() => {
    if (!thumbRef.current) return;
    const x = clamp01(hsl.s / 100);
    const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
    const y = clamp01(1 - hsl.l / topLightness);
    thumbRef.current.style.left = `${x * 100}%`;
    thumbRef.current.style.top = `${y * 100}%`;
    if (!isThumbVisible.current) {
      isThumbVisible.current = true;
      thumbRef.current.style.opacity = '1';
    }
  }, [hsl.s, hsl.l]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging.current && containerRef.current)) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      const saturation = x * 100;
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
      const nextL = topLightness * (1 - y);
      const next = hslToOklch(hsl.h, saturation, nextL);
      setColor({ l: next.l, c: next.c, h: next.h });
    },
    [hsl.h, setColor]
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
      style={{ background }}
      {...props}
    >
      <div
        className={cx(styles.sliderThumb, styles.selectionThumb)}
        ref={thumbRef}
        style={{
          background: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          opacity: 0
        }}
      />
    </div>
  );
};
