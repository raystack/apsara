import { mergeProps, useRender } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './text.module.css';

export const textVariants = cva(styles.text, {
  variants: {
    variant: {
      primary: styles['text-primary'],
      secondary: styles['text-secondary'],
      tertiary: styles['text-tertiary'],
      emphasis: styles['text-emphasis'],
      accent: styles['text-accent'],
      attention: styles['text-attention'],
      danger: styles['text-danger'],
      success: styles['text-success']
    },
    size: {
      micro: styles['text-micro'],
      mini: styles['text-mini'],
      small: styles['text-small'],
      regular: styles['text-regular'],
      large: styles['text-large']
    },
    weight: {
      regular: styles['text-weight-regular'],
      medium: styles['text-weight-medium']
    },
    transform: {
      capitalize: styles['text-transform-capitalize'],
      uppercase: styles['text-transform-uppercase'],
      lowercase: styles['text-transform-lowercase']
    },
    align: {
      center: styles['text-align-center'],
      start: styles['text-align-start'],
      end: styles['text-align-end'],
      justify: styles['text-align-justify']
    },
    lineClamp: {
      1: [styles['text-line-clamp'], styles['text-line-clamp-1']],
      2: [styles['text-line-clamp'], styles['text-line-clamp-2']],
      3: [styles['text-line-clamp'], styles['text-line-clamp-3']],
      4: [styles['text-line-clamp'], styles['text-line-clamp-4']],
      5: [styles['text-line-clamp'], styles['text-line-clamp-5']]
    },
    underline: {
      true: styles['text-underline']
    },
    strikeThrough: {
      true: styles['text-strike-through']
    },
    italic: {
      true: styles['text-italic']
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'small',
    weight: 'regular'
  },
  compoundVariants: [
    {
      strikeThrough: true,
      underline: true,
      className: styles['text-italic-strike-through']
    }
  ]
});

export type TextBaseProps = VariantProps<typeof textVariants>;

export type TextProps = TextBaseProps & useRender.ComponentProps<'span'>;

export function Text({
  className,
  size,
  variant,
  weight,
  transform,
  align,
  lineClamp,
  underline,
  strikeThrough,
  italic,
  render,
  ref,
  ...props
}: TextProps) {
  const textClassName = textVariants({
    size,
    className,
    weight,
    variant,
    transform,
    align,
    lineClamp,
    underline,
    strikeThrough,
    italic
  });

  const element = useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: mergeProps<'span'>({ className: textClassName }, props)
  });

  return element;
}

Text.displayName = 'Text';
