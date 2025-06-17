import { cx } from 'class-variance-authority';
import { Select as SelectPrimitive } from 'radix-ui';
import {
  ElementRef,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { Chip } from '../chip';
import { Text } from '../text';
import styles from './select.module.css';
import { ItemType } from './types';

interface SelectMultipleValueProps extends SelectPrimitive.SelectValueProps {
  data: ItemType[];
}

/*
 * Approximate width calculation based on font size
 * Average character width is roughly 0.6 times the font size
 */
const calculateTextWidth = (text: string, fontSize: number = 11): number => {
  const avgCharWidth = fontSize * 0.6;
  return text.length * avgCharWidth;
};

export const SelectMultipleValue = forwardRef<
  ElementRef<typeof SelectPrimitive.Value>,
  SelectMultipleValueProps
>(({ data = [], ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(data.length);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width - 70);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    // Calculate chip widths based on text length and icon width
    const chipWidths: number[] = data.map(item => {
      const text =
        typeof item.children === 'string' ? item.children : item.value;
      const iconWidth = item.leadingIcon ? 16 : 0;
      return calculateTextWidth(text) + 8 + iconWidth;
    });

    let totalWidth = 0;
    let count = 0;

    // Always show at least one chip
    if (data.length > 0) {
      count = 1;
      totalWidth = chipWidths[0];
    }

    // Try to fit more chips
    for (let i = 1; i < data.length; i++) {
      const newWidth = totalWidth + chipWidths[i];
      if (newWidth <= containerWidth) {
        count++;
        totalWidth = newWidth;
      } else {
        break;
      }
    }

    setVisibleCount(count);
  }, [data, containerWidth]);

  return (
    <div ref={containerRef} className={cx(styles.valueContent)}>
      <SelectPrimitive.Value ref={ref} {...props}>
        <div className={cx(styles.valueContent)}>
          {data.slice(0, visibleCount).map(item => (
            <Chip key={item.value} leadingIcon={item.leadingIcon}>
              {typeof item.children === 'string' ? item.children : item.value}
            </Chip>
          ))}
          {data.length > visibleCount && (
            <Text>+{data.length - visibleCount}</Text>
          )}
        </div>
      </SelectPrimitive.Value>
    </div>
  );
});
