import { Flex, Link } from "@raystack/apsara";

export const NavbarLinks = () => {
  return (
    <Flex gap="large">
      <Link href="/docs/primitives/overview/introduction">Doccumentation</Link>
      <Link href="/examples">Examples</Link>
    </Flex>
  );
};
