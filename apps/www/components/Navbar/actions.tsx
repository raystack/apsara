import { SunIcon } from "@radix-ui/react-icons";
import { Button, useApsaraTheme } from "@raystack/apsara";
export const NavbarAcitons = () => {
  const { setTheme, themeName } = useApsaraTheme();
  console.log(themeName);
  return (
    <Button
      onClick={() => {
        return themeName === "dark" ? setTheme("light") : setTheme("dark");
      }}
    >
      <SunIcon width="16" height="16" />
    </Button>
  );
};
