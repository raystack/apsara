export const GITHUB_URL = 'https://github.com/raystack/apsara';
export const NPM_URL = 'https://www.npmjs.com/package/@raystack/apsara';
export const INSTALL_COMMAND = 'pnpm add @raystack/apsara';

type NavLink = { label: string; href: string; external?: boolean };

export const NAV_LINKS: NavLink[] = [
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/docs/components/accordion' },
  { label: 'Theme', href: '/docs/theme/overview' },
  { label: 'AI elements', href: '/docs/ai-elements/chat' }
];

export const FOOTER_LINKS: NavLink[] = [
  { label: 'Getting started', href: '/docs/getting-started' },
  { label: 'Components', href: '/docs/components/accordion' },
  { label: 'Upgrading', href: '/docs/upgrading' },
  { label: 'GitHub', href: GITHUB_URL, external: true },
  { label: 'npm', href: NPM_URL, external: true }
];
