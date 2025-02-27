import { Flex, ThemeSwitcher } from "@raystack/apsara/v1";
import { Link } from "@raystack/apsara";

export const NavbarLinks = () => {
  return (
    <Flex gap="large">
      <Link href="/docs/primitives/overview/introduction">Documentation</Link>
      <Link href="/examples">Examples</Link>
      <ThemeSwitcher size={16} />
    </Flex>
  );
};
