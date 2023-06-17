import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Box } from "~/components/box";
import { useApsaraTheme } from "~/components/themeprovider";
import { CSS } from "../../stitches.config";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

type Props = { size?: number } & { css?: CSS };
export function ThemeSwitcher({ size = 30, css }: Props) {
  const { themeName, setTheme } = useApsaraTheme();
  const onClickHandler = () => {
    setTheme(themeName === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <Box css={css}>
      {themeName === Theme.DARK ? (
        <SunIcon width={size} height={size} onClick={onClickHandler} />
      ) : (
        <MoonIcon width={size} height={size} onClick={onClickHandler} />
      )}
    </Box>
  );
}
