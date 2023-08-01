import { SunIcon } from "@radix-ui/react-icons";
import { Button, useTheme } from "@raystack/apsara";
export const NavbarAcitons = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => {
        return theme === "dark" ? setTheme("light") : setTheme("dark");
      }}
    >
      <SunIcon width="16" height="16" />
    </Button>
  );
};
