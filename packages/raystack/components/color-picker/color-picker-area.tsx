'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  KeyboardEvent as ReactKeyboardEvent,
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
  hslToOklch,
  oklchToHsl,
  oklchToRgb
} from './utils';

// Internal pixel resolution for the C × L plane. CSS upscales this to the
// container size; a 96² grid is the sweet spot between a smooth gradient and
// keeping the per-hue repaint comfortably inside one frame.
const CANVAS_RES = 96;

// Keyboard nudge sizes in the same normalized 0..1 pad space the pointer
// uses: 1% of an axis per Arrow press, 10% for Shift+Arrow and PageUp/Down.
const STEP = 0.01;
const STEP_LARGE = 0.1;

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
  // Use the native CSS oklch() so the thumb renders the actual picked color on
  // wide-gamut (P3) displays — hex would silently sRGB-clip wide-gamut picks.
  const thumbColor = useMemo(
    () => `oklch(${lightness} ${chroma} ${hue})`,
    [lightness, chroma, hue]
  );

  // Coalesce hue-driven repaints into one per animation frame. A fast slider
  // sweep would otherwise queue dozens of synchronous 96² repaints back-to-back.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const handle = requestAnimationFrame(() => {
      if (cancelled) return;
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
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(handle);
    };
  }, [hue]);

  useEffect(() => {
    if (!thumbRef.current) return;
    const x = clamp01(chroma / CHROMA_MAX);
    const y = clamp01(1 - lightness);
    thumbRef.current.style.setProperty('--thumb-x', String(x));
    thumbRef.current.style.setProperty('--thumb-y', String(y));
    if (!isThumbVisible.current) {
      isThumbVisible.current = true;
      thumbRef.current.style.opacity = '1';
    }
  }, [lightness, chroma]);

  // Shared color-computation path. Takes normalized 0..1 pad coordinates
  // (x = chroma axis, y = lightness axis) and writes them into OKLCH state.
  // Pointer drag and keyboard both go through this so behavior can't diverge.
  const applyPosition = useCallback(
    (x: number, y: number) => {
      setColor({ c: clamp01(x) * CHROMA_MAX, l: 1 - clamp01(y) });
    },
    [setColor]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging.current && containerRef.current)) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      applyPosition(x, y);
    },
    [applyPosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDragging.current = true;
      handlePointerMove(e.nativeEvent);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      // pointercancel fires instead of pointerup when the OS/browser preempts
      // the gesture (system dialog, palm rejection, etc.). Handling it with the
      // same cleanup prevents stranded listeners + isDragging stuck at true.
      window.addEventListener('pointercancel', handlePointerUp);
    },
    [handlePointerMove, handlePointerUp]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      // Current thumb position, mirrored from the same math the thumb effect
      // uses (x = chroma / CHROMA_MAX, y = 1 - lightness).
      let x = clamp01(chroma / CHROMA_MAX);
      let y = clamp01(1 - lightness);
      const step = e.shiftKey ? STEP_LARGE : STEP;
      switch (e.key) {
        case 'ArrowLeft':
          x -= step;
          break;
        case 'ArrowRight':
          x += step;
          break;
        case 'ArrowUp':
          y -= step; // up = more lightness (y = 1 - L)
          break;
        case 'ArrowDown':
          y += step;
          break;
        case 'PageUp':
          y -= STEP_LARGE;
          break;
        case 'PageDown':
          y += STEP_LARGE;
          break;
        case 'Home':
          x = 0; // no chroma
          break;
        case 'End':
          x = 1; // max chroma
          break;
        default:
          return; // let other keys (Tab, etc.) pass through
      }
      e.preventDefault();
      applyPosition(x, y);
    },
    [applyPosition, chroma, lightness]
  );

  const valueText =
    `chroma ${Math.round((chroma / CHROMA_MAX) * 100)}%, ` +
    `lightness ${Math.round(lightness * 100)}%`;

  return (
    <div
      className={cx(styles.selectionRoot, className)}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      role='slider'
      tabIndex={0}
      aria-label='Color area, chroma and lightness'
      aria-valuetext={valueText}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round((chroma / CHROMA_MAX) * 100)}
      data-slot='color-picker-area'
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_RES}
        height={CANVAS_RES}
        className={styles.selectionCanvas}
        data-slot='color-picker-area-canvas'
      />
      <div
        className={cx(styles.sliderThumb, styles.selectionThumb)}
        ref={thumbRef}
        style={{ background: thumbColor, opacity: 0 }}
        data-slot='color-picker-area-thumb'
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
    thumbRef.current.style.setProperty('--thumb-x', String(x));
    thumbRef.current.style.setProperty('--thumb-y', String(y));
    if (!isThumbVisible.current) {
      isThumbVisible.current = true;
      thumbRef.current.style.opacity = '1';
    }
  }, [hsl.s, hsl.l]);

  // Shared color-computation path. Takes normalized 0..1 pad coordinates
  // (x = saturation axis, y = scaled-lightness axis) and round-trips through
  // hslToOklch into OKLCH state. Pointer drag and keyboard both go through
  // this so behavior can't diverge.
  const applyPosition = useCallback(
    (x: number, y: number) => {
      const cx0 = clamp01(x);
      const saturation = cx0 * 100;
      const topLightness = cx0 < 0.01 ? 100 : 50 + 50 * (1 - cx0);
      const nextL = topLightness * (1 - clamp01(y));
      const next = hslToOklch(hsl.h, saturation, nextL);
      setColor({ l: next.l, c: next.c, h: next.h });
    },
    [hsl.h, setColor]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging.current && containerRef.current)) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = containerRef.current.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      applyPosition(x, y);
    },
    [applyPosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDragging.current = true;
      handlePointerMove(e.nativeEvent);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      // pointercancel fires instead of pointerup when the OS/browser preempts
      // the gesture (system dialog, palm rejection, etc.). Handling it with the
      // same cleanup prevents stranded listeners + isDragging stuck at true.
      window.addEventListener('pointercancel', handlePointerUp);
    },
    [handlePointerMove, handlePointerUp]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      // Current position mirrored from the same math the thumb effect uses.
      let x = clamp01(hsl.s / 100);
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
      let y = clamp01(1 - hsl.l / topLightness);
      const step = e.shiftKey ? STEP_LARGE : STEP;
      switch (e.key) {
        case 'ArrowLeft':
          x -= step;
          break;
        case 'ArrowRight':
          x += step;
          break;
        case 'ArrowUp':
          y -= step;
          break;
        case 'ArrowDown':
          y += step;
          break;
        case 'PageUp':
          y -= STEP_LARGE;
          break;
        case 'PageDown':
          y += STEP_LARGE;
          break;
        case 'Home':
          x = 0;
          break;
        case 'End':
          x = 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      applyPosition(x, y);
    },
    [applyPosition, hsl.s, hsl.l]
  );

  const topLightnessNow =
    hsl.s / 100 < 0.01 ? 100 : 50 + 50 * (1 - hsl.s / 100);
  const valueText =
    `saturation ${Math.round(hsl.s)}%, ` +
    `brightness ${Math.round((hsl.l / topLightnessNow) * 100)}%`;

  return (
    <div
      className={cx(styles.selectionRoot, className)}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      role='slider'
      tabIndex={0}
      aria-label='Color area, saturation and brightness'
      aria-valuetext={valueText}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(hsl.s)}
      style={{ background }}
      data-slot='color-picker-area'
      {...props}
    >
      <div
        className={cx(styles.sliderThumb, styles.selectionThumb)}
        ref={thumbRef}
        style={{
          background: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          opacity: 0
        }}
        data-slot='color-picker-area-thumb'
      />
    </div>
  );
};
