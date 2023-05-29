import { Badge, Box, Flex, ScrollArea, styled, Text, useApsaraTheme } from "@odpf/apsara";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageProps, primitivesRoutes } from "~/utils/routes";

function useCurrentPageSlug() {
    const router = useRouter();
    const routerSlug = router.query.slug;
    let currentPageSlug = router.pathname.substring(1);

    if (Array.isArray(routerSlug)) {
        return currentPageSlug.replace("[...slug]", routerSlug[0]);
    }
    return currentPageSlug.replace("[slug]", routerSlug as any);
}

export function NavHeading({ children, ...props }: { children: React.ReactNode }) {
    return (
        <Text as="h4" size="3" css={{ fontWeight: 500, px: "$3", py: "$2" }} {...props}>
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

export function NavItem({ children, active, disabled, href, ...props }: NavItemProps) {
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
                        boxShadow: "inset 0 0 0 1px $colors$violet7",
                    },
                }}
            >
                <Link href={href} style={{ textDecoration: "none", padding: "12px 16px", width: "100%", color: "rgb(17, 24, 28)" }}>
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
        <Text size="3"  css={{ fontWeight: active ? "500" : "none" }}>
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
        <Flex css={{ flexGrow: 1, display: "none", "@bp2": { display: "block" } }}>
            <Flex
                direction="column"
                css={{
                    height: "calc(100% - 90px)",
                    position: "fixed",
                    top: "90px",
                    bottom: "2rem",
                    width: "220px",
                    marginRight: "20px",
                    WebkitOverflowScrolling: "touch",
                    WebkitFlexShrink: "0",
                    zIndex: 100,
                }}
            >
                {children}
            </Flex>
            <Box css={{ height: "$5", "@bp2": { height: "$8" } }} />
        </Flex>
    );
}

const PageWrapper = styled(Flex, {
    minHeight: "calc(100vh - 64px)",
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "0 1$4",
});

const iconStyle = {
    padding: "4px",
    borderRadius: "4px",
    width: "20px",
    height: "auto",
};

function ContentWrapper(props: any) {
    return (
        <Flex
            direction="column"
            css={{
                width: "100%",
                maxWidth: "100%",
                paddingLeft: "40px",
                padding: "40px $4",
                "@bp2": { maxWidth: "calc(100% - 220px)", padding: "40px 60px" },
            }}
            {...props}
        />
    );
}

export function PrimitivePage({ children }: { children: React.ReactNode }) {
    const currentPageSlug = useCurrentPageSlug();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [overviews, components] = primitivesRoutes;
    const { themePreference, setTheme, themeName, theme, themes, updateTheme } = useApsaraTheme();
    const bgColor = themeName === "dark" ? "rgba(21, 23, 24, 0.9)" : "rgba(255, 255, 255, 0.9)";

    return (
        <Flex direction="column">
            <header style={{ display: "flex", height: "64px" }}>
                <Flex
                    align="center"
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        right: "0",
                        height: "64px",
                        paddingRight: "0",
                        borderBottom: "1px solid #d3d7df",
                        backgroundColor: `${bgColor}`,
                        zIndex: 999,
                    }}
                >
                    <Flex align="center" css={{ maxWidth: "1250px", margin: "auto", width: "100%" }}>
                        <Flex direction="row" align="center">
                            <NavItem href={`/`}>
                                <Text size="4" css={{ fontWeight: "$700" }} color="contrast">
                                    Apsara 2.0
                                </Text>
                            </NavItem>
                        </Flex>
                        <Flex direction="row" align="center" justify="center" gap="6" css={{ flexGrow: 1 }}>
                            <Text css={{ fontWeight: "$500" }} size="2">
                                Overview
                            </Text>
                            <Text css={{ fontWeight: "$500" }} size="2">
                                Components
                            </Text>
                            <Text css={{ fontWeight: "$500" }} size="2">
                                Hooks
                            </Text>
                        </Flex>
                        <Flex gap="3" css={{ background: "$gray4", padding: "$2", borderRadius: "$3" }}>
                            <DesktopIcon
                                onClick={() => setTheme("auto")}
                                style={{
                                    ...iconStyle,
                                    ...(themePreference === "auto" ? { background: `${bgColor}` } : {}),
                                }}
                            />
                            <SunIcon
                                onClick={() => setTheme("light")}
                                style={{
                                    ...iconStyle,
                                    ...(themePreference === "light" ? { background: `${bgColor}` } : {}),
                                }}
                            />
                            <MoonIcon
                                onClick={() => setTheme("dark")}
                                style={{
                                    ...iconStyle,
                                    ...(themePreference === "dark" ? { background: `${bgColor}` } : {}),
                                }}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </header>
            <PageWrapper>
                <NavWrapper isMobileMenuOpen={isMobileMenuOpen}>
                    <ScrollArea>
                        <Box
                            css={{
                                marginTop: "$4",
                                maxHeight: "100vh",
                                display: isSearchOpen ? "none" : undefined,
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
                                        <NavItemTitle active={currentPageSlug === page.slug}>{page.title}</NavItemTitle>
                                        {page.preview && (
                                            <Badge variant="blue" css={{ marginLeft: "$2" }}>
                                                Preview
                                            </Badge>
                                        )}
                                        {page.deprecated && (
                                            <Badge variant="yellow" css={{ marginLeft: "$2" }}>
                                                Deprecated
                                            </Badge>
                                        )}
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
                                        {page.preview && (
                                            <Badge variant="blue" css={{ marginLeft: "$2" }}>
                                                Preview
                                            </Badge>
                                        )}
                                        {page.deprecated && (
                                            <Badge variant="yellow" css={{ marginLeft: "$2" }}>
                                                Deprecated
                                            </Badge>
                                        )}
                                    </NavItem>
                                ))}
                            </Box>
                        </Box>
                    </ScrollArea>
                </NavWrapper>
                <ContentWrapper>{children}</ContentWrapper>
            </PageWrapper>
        </Flex>
    );
}
