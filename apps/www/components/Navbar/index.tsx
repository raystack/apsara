import { Container, Flex } from "@odpf/apsara";
import { NavbarLinks } from "./links";
import { Logo } from "./logo";
import styles from "./navbar.module.css";

export const Navbar = () => {
  return (
    <div
      style={{
        position: "sticky",
        right: 0,
        top: 0,
        left: 0,
        background: "var(--background-base)",
        borderBottom: "1px solid var(--border-base)",
        padding: "16px 0",
      }}
    >
      <Container>
        <Flex align="center" justify="between" className={styles.navbar}>
          <Logo />
          <NavbarLinks />
        </Flex>
      </Container>
    </div>
  );
};
