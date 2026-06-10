// url=<FIGMA_LINK>?node-id=9053-3916
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/toolbar/toolbar.tsx
// component=Toolbar

import figma from 'figma';

const instance = figma.selectedInstance;

// Render every direct child of the Toolbar frame into a single flat list of
// sections (so the array flattens correctly when interpolated):
// - A Button instance becomes a <Toolbar.Button>. When the button is just a
//   plain text/neutral/small button (which is exactly Toolbar.Button's default
//   render), collapse to <Toolbar.Button>{label}</Toolbar.Button>; otherwise
//   forward the full button via the `render` prop.
// - An uncoded instance whose layer name starts with "Line" → Toolbar.Separator.
//   NOTE: raw Figma LINE/vector primitives are NOT exposed in `children` by the
//   Code Connect API — only INSTANCE/TEXT children are. A divider only renders
//   here if it is an instance (e.g. a Separator/Divider component).
// - Any other child is passed through and rendered directly.
const items = instance.children.flatMap(child => {
  if (child.type === 'TEXT') {
    return figma.code`
      ${child.textContent}`.sections;
  }
  if (child.type !== 'INSTANCE') {
    return [];
  }

  // Separator: an uncoded instance whose layer name starts with "Line".
  if (!child.hasCodeConnect() && child.name.startsWith('Line')) {
    return figma.code`
      <Toolbar.Separator />`.sections;
  }

  if (child.name === 'Button' && child.hasCodeConnect()) {
    const variant = child.getEnum('Variant', {
      Solid: 'solid',
      Outline: 'outline',
      Ghost: 'ghost',
      Text: 'text'
    });
    const color = child.getEnum('Color', {
      Accent: 'accent',
      Neutral: 'neutral',
      Danger: 'danger',
      Success: 'success'
    });
    const size = child.getEnum('Size', { Small: 'small', Normal: 'normal' });
    // "Plain" = the default Toolbar.Button render (text/neutral/small) with a
    // label and no icons, disabled or loading state — i.e. nothing extra.
    const isPlain =
      variant === 'text' &&
      color === 'neutral' &&
      size === 'small' &&
      child.getBoolean('Label') &&
      !child.getBoolean('Leading Visible') &&
      !child.getBoolean('Trailing Visible') &&
      !child.getEnum('State', { Disabled: true }) &&
      !child.getEnum('Label Copy', { 'Loading...': true });

    if (isPlain) {
      return figma.code`
      <Toolbar.Button>${child.getString('Label Copy')}</Toolbar.Button>`
        .sections;
    }
    return figma.code`
      <Toolbar.Button render={${child.executeTemplate().example}} />`.sections;
  }

  // Any other instance → render it as-is.
  return child.hasCodeConnect() ? child.executeTemplate().example : [];
});

// Fall back to a minimal realistic example when the frame exposes no
// resolvable children (e.g. nothing selected).
const fallback = figma.code`<Toolbar>
      <Toolbar.Group>
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Button>Link</Toolbar.Button>
    </Toolbar>`;

export default {
  id: 'Toolbar',
  imports: ["import { Toolbar } from '@raystack/apsara'"],
  example:
    items.length > 0
      ? figma.code`<Toolbar>${items}
    </Toolbar>`
      : fallback,
  metadata: { nestable: false }
};
