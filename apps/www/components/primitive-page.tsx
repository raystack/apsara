import "@raystack/ui/index.css";

import {
  DesktopIcon,
  DiscIcon,
  MoonIcon,
  SunIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  ScrollArea,
  Sheet,
  styled,
  Text,
  useApsaraTheme,
} from "@raystack/apsara";
import { Badge } from "@raystack/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import type { Frontmatter } from "~/types/frontmatter";
import { PageProps, primitivesRoutes } from "~/utils/routes";
import { Toc } from "./toc";

function useCurrentPageSlug() {
  const router = useRouter();
  const routerSlug = router.query.slug;
  let currentPageSlug = router.pathname.substring(1);

  if (Array.isArray(routerSlug)) {
    return currentPageSlug.replace("[...slug]", routerSlug[0]);
  }
  return currentPageSlug.replace("[slug]", routerSlug as any);
}

export function NavHeading({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <Text as="h4" size="3" css={{ fontWeight: 500, margin: "$3" }} {...props}>
      {children}
    </Text>
  );
}

type NavItemProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  href: string;
};

export function NavItem({
  children,
  active,
  disabled,
  href,
  ...props
}: NavItemProps) {
  const { themeName } = useApsaraTheme();
  return (
    <Box as="span">
      <Box
        {...props}
        css={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: disabled ? "$gray10" : "$hiContrast",

          marginRight: "$3",
          marginLeft: "$3",
          marginBottom: "2px",
          borderRadius: "$2",
          userSelect: "none",
          minHeight: "$6",
          backgroundColor: active ? "$gray4" : "transparent",
          transition: "background-color 50ms linear",
          ...(disabled ? { pointerEvents: "none" } : {}),
          "&:not(:last-of-type)": {
            marginBottom: 1,
          },
          "&:hover": {
            fontWeight: active ? "bold" : "none",
            backgroundColor: "$gray2",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "inset 0 0 0 1px $colors$primary7",
          },
        }}
      >
        <Link
          href={href}
          style={{
            textDecoration: "none",
            padding: "12px 16px",
            width: "100%",
            color: `${themeName === "dark" ? "#f2f2f2" : "rgb(17, 24, 28)"}`,
          }}
        >
          <Text size="3" css={{ fontWeight: active ? "500" : "none" }}>
            {children}
          </Text>
        </Link>
      </Box>
    </Box>
  );
}

export function NavItemTitle({ children, active }: any) {
  return (
    <Text size="3" css={{ fontWeight: active ? "500" : "none" }}>
      {children}
    </Text>
  );
}

function NavWrapper({ children, isMobileMenuOpen }: any) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  useEffect(() => {
    const mediaQueryList = window.matchMedia("(min-width: 900px)");
    const handleChange = () => setIsMobileLayout(!mediaQueryList.matches);
    handleChange();

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return (
    <Flex
      direction="column"
      css={{
        display: "none",
        width: "260px",
        marginRight: "20px",
        borderRight: "1px solid $borderBase",
        WebkitOverflowScrolling: "touch",
        WebkitFlexShrink: "0",
        zIndex: 1,
        "@bp2": { display: "block" },
      }}
    >
      {children}
    </Flex>
  );
}

const PageWrapper = styled(Flex, {
  height: "calc(100vh - 64px)",
  width: "100%",
  padding: "0",
  overflow: "hidden",
});

const iconStyle = {
  padding: "4px",
  borderRadius: "4px",
  width: "20px",
  height: "auto",
};
export function PrimitivePage({
  children,
  frontmatter,
}: {
  children: React.ReactNode;
  frontmatter: Frontmatter;
}) {
  const containerElm = useRef(null);

  return (
    <Flex direction="column">
      <Header />
      <Flex css={{ height: "calc(100vh - 64px)" }}>
        <NavWrapper>
          <LeftSideBar />
        </NavWrapper>
        <PageWrapper>
          <Flex ref={containerElm} css={{ overflowY: "scroll", width: "100%" }}>
            <Flex
              direction="column"
              css={{
                width: "100%",
                maxWidth: "1080px",
                margin: "0 auto 20px",
                padding: "16px 32px",
                "@bp2": { padding: "32px 60px" },
              }}
            >
              {children}
            </Flex>

            <RightSideBar
              frontmatter={frontmatter}
              containerElm={containerElm}
            />
          </Flex>
        </PageWrapper>
      </Flex>
    </Flex>
  );
}

const Header = () => {
  const { themePreference, setTheme, themeName, theme, themes, updateTheme } =
    useApsaraTheme();
  const bgColor =
    themeName === "dark" ? "rgba(21, 23, 24, 0.9)" : "rgba(255, 255, 255, 0.9)";

  return (
    <header style={{ display: "flex", height: "64px" }}>
      <Flex
        align="center"
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          height: "64px",
          padding: "0 16px",
          borderBottom: "1px solid #d3d7df",
          backgroundColor: `${bgColor}`,
          zIndex: 1,
        }}
      >
        <Flex align="center" css={{ margin: "auto", width: "100%" }}>
          <Flex direction="row" align="center">
            <NavItem href={`/`}>
              <DiscIcon />
            </NavItem>
          </Flex>
          <Flex
            direction="row"
            align="center"
            justify="start"
            gap="6"
            css={{ flexGrow: 1 }}
          >
            <Text css={{ fontWeight: "$500" }} size="2">
              Overview
            </Text>

            <Badge style={{ fontWeight: "$500" }}>Components</Badge>
          </Flex>
          <Flex
            gap="3"
            css={{ background: "$gray4", padding: "$2", borderRadius: "$3" }}
          >
            <DesktopIcon
              onClick={() => setTheme("auto")}
              style={{
                ...iconStyle,
                ...(themePreference === "auto"
                  ? { background: `${bgColor}` }
                  : {}),
              }}
            />
            <SunIcon
              onClick={() => setTheme("light")}
              style={{
                ...iconStyle,
                ...(themePreference === "light"
                  ? { background: `${bgColor}` }
                  : {}),
              }}
            />
            <MoonIcon
              onClick={() => setTheme("dark")}
              style={{
                ...iconStyle,
                ...(themePreference === "dark"
                  ? { background: `${bgColor}` }
                  : {}),
              }}
            />
          </Flex>
          <Sheet>
            <Sheet.Trigger asChild>
              <Button css={{ display: "block", "@bp1": { display: "none" } }}>
                <TextAlignJustifyIcon />
              </Button>
            </Sheet.Trigger>
            <Sheet.Content side="left">
              <LeftSideBar />
            </Sheet.Content>
          </Sheet>
        </Flex>
      </Flex>
    </header>
  );
};

const LeftSideBar = () => {
  const currentPageSlug = useCurrentPageSlug();
  const [overviews, components] = primitivesRoutes;

  return (
    <ScrollArea>
      <Box
        css={{
          marginTop: "$4",
          maxHeight: "100vh",
        }}
      >
        <Box key={overviews.label} css={{ marginBottom: "$4" }}>
          <NavHeading>{overviews.label}</NavHeading>

          {overviews.pages.map((page: PageProps) => (
            <NavItem
              key={page.slug}
              href={`/${page.slug}`}
              active={currentPageSlug === page.slug}
            >
              <NavItemTitle active={currentPageSlug === page.slug}>
                {page.title}
              </NavItemTitle>
            </NavItem>
          ))}
        </Box>
        <Box key={components.label} css={{ marginBottom: "$4" }}>
          <NavHeading>{components.label}</NavHeading>

          {components.pages.map((page: PageProps) => (
            <NavItem
              key={page.slug}
              href={`/${page.slug}`}
              active={currentPageSlug === page.slug}
            >
              {page.title}
            </NavItem>
          ))}
        </Box>
      </Box>
    </ScrollArea>
  );
};

const RightSideBar = ({
  frontmatter,
  containerElm,
}: {
  frontmatter: Frontmatter;
  containerElm: MutableRefObject<null>;
}) => {
  return (
    <Box
      as="aside"
      css={{
        display: "none",
        "@media (min-width: 1440px)": {
          display: "block",
          position: "sticky",
          top: 0,
          width: 280,
          flexShrink: 0,
          zIndex: 1,
        },
      }}
    >
      <ScrollArea>
        <Toc title={frontmatter.title} containerElm={containerElm} />
      </ScrollArea>
    </Box>
  );
};
