import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Box } from "~/box";
import { useTheme } from "./theme";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

type Props = { size?: number };
export function ThemeSwitcher({ size = 30, ...props }: Props) {
  const { theme, setTheme } = useTheme();
  const onClickHandler = () => {
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <Box {...props}>
      {theme === Theme.DARK ? (
        <SunIcon width={size} height={size} onClick={onClickHandler} />
      ) : (
        <MoonIcon width={size} height={size} onClick={onClickHandler} />
      )}
    </Box>
  );
}
