import { Button, Container, DropdownMenu, Flex } from "@raystack/ui";
import { NavbarAcitons } from "./actions";
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
        zIndex: 99,
        background: "white",
        borderBottom: "1px solid var(--clr-border-base)",
        padding: "16px 0",
      }}
    >
      <Container>
        <Flex align="center" justify="between" className={styles.navbar}>
          <Logo />
          <NavbarLinks />
          <NavbarAcitons />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary">Dropdown button</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Group>
                <DropdownMenu.Item>Cell Item</DropdownMenu.Item>
                <DropdownMenu.Item>Cell Item</DropdownMenu.Item>
                <DropdownMenu.Item>Cell Item</DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Flex>
      </Container>
    </div>
  );
};
