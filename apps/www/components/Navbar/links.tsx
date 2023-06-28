import { Flex, Link } from "@raystack/ui";

export const NavbarLinks = () => {
  return (
    <Flex gap="large">
      <Link href="/docs/primitives/overview/introduction">Doccumentation</Link>
      <Link href="/examples">Examples</Link>
      <Link href="/">FAQs</Link>
    </Flex>
  );
};
