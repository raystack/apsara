import { ComponentProps } from 'react';

export function Box(props: ComponentProps<'div'>) {
  return <div {...props} />;
}

Box.displayName = 'Box';
