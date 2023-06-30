import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Box } from "~/box";
import { useApsaraTheme } from "./themeprovider";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

type Props = { size?: number };
export function ThemeSwitcher({ size = 30, ...props }: Props) {
  const { themeName, setTheme } = useApsaraTheme();
  const onClickHandler = () => {
    setTheme(themeName === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <Box {...props}>
      {themeName === Theme.DARK ? (
        <SunIcon width={size} height={size} onClick={onClickHandler} />
      ) : (
        <MoonIcon width={size} height={size} onClick={onClickHandler} />
      )}
    </Box>
  );
}
