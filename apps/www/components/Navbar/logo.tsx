import { Flex } from "@raystack/ui";
import Image from "next/image";

export const Logo = () => {
  return (
    <Flex gap="small" align="center">
      <Image src="/logo.svg" width={20} height={20} alt="Logo" />
      apsara
    </Flex>
  );
};
