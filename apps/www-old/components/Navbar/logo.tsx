import { Link } from "@raystack/apsara";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link
      href="/"
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      <Image src="/logo.svg" width={20} height={20} alt="Logo" />
      apsara
    </Link>
  );
};
