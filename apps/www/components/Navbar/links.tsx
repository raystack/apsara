import { Flex, Link, ThemeSwitcher } from "@raystack/apsara";

export const NavbarLinks = () => {
  return (
    <Flex gap="large">
      <Link href="/docs/primitives/overview/introduction">Documentation</Link>
      <Link href="/examples">Examples</Link>
      <ThemeSwitcher size={16} />
    </Flex>
  );
};
