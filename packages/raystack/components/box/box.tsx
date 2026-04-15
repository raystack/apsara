import { ComponentProps } from 'react';

/**
 * @deprecated `Box` is deprecated. This component will be removed in a future major version.
 * Use `Flex` component instead.
 */
export function Box(props: ComponentProps<'div'>) {
  return <div {...props} />;
}

Box.displayName = 'Box';
