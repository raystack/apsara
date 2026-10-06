'use client';

import { NavbarRoot } from './navbar-root';
import { NavbarCenter, NavbarEnd, NavbarStart } from './navbar-sections';

export const Navbar = Object.assign(NavbarRoot, {
  Start: NavbarStart,
  Center: NavbarCenter,
  End: NavbarEnd
});
