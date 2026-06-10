// url=<FIGMA_LINK>?node-id=8428-3139
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/navbar/navbar.tsx
// component=Navbar

import figma from 'figma';

// Navbar has no Figma component properties — compose a minimal realistic
// example using the public sub-components (Start / Center / End).

export default {
  id: 'Navbar',
  imports: ["import { Navbar } from '@raystack/apsara'"],
  example: figma.code`<Navbar>
  <Navbar.Start>Logo</Navbar.Start>
  <Navbar.Center>Navigation</Navbar.Center>
  <Navbar.End>Actions</Navbar.End>
</Navbar>`,
  metadata: { nestable: false }
};
