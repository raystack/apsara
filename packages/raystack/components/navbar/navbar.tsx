'use client';

import { NavbarRoot } from './navbar-root';
import { NavbarEnd, NavbarStart } from './navbar-sections';

export const Navbar = Object.assign(NavbarRoot, {
  Start: NavbarStart,
  End: NavbarEnd
});
