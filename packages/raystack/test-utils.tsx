import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

function render(ui: ReactElement, options: RenderOptions = {}): RenderResult {
  return rtlRender(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

export * from '@testing-library/react';
export { render }; 