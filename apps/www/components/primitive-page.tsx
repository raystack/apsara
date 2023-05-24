import { Badge, Box, Container, Flex, ScrollArea, styled, Text } from "@odpf/apsara";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { primitivesRoutes, RouteProps } from "~/utils/routes";

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
                    py: "$2",
                    px: "$3",
                    backgroundColor: active ? "$violet5" : "transparent",
                    borderRadius: 9999,
                    userSelect: "none",
                    minHeight: "$6",
                    transition: "background-color 50ms linear",
                    ...(disabled ? { pointerEvents: "none" } : {}),
                    "&:not(:last-of-type)": {
                        mb: 1,
                    },
                    "&:hover": {
                        fontWeight: active ? "700" : "none",
                    },
                    "&:focus": {
                        outline: "none",
                        boxShadow: "inset 0 0 0 1px $colors$violet7",
                    },
                }}
            >
                <Link href={href} style={{ textDecoration: "none"}}>{children}</Link>
            </Box>
        </Box>
    );
}

export function NavItemTitle({ children }: any) {
    return (
        <Text size="2" css={{ color: "inherit", lineHeight: "1" }}>
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
        <Box
            css={{
                position: "fixed",
                top: "$sizes$8",
                left: 0,
                bottom: 0,
                zIndex: 1,

                width: "100%",
                maxHeight: "auto",

                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",

                backgroundColor: "$loContrast",

                display: isMobileMenuOpen ? "block" : "none",
                "@bp2": { display: "block", width: "250px" },
            }}
        >
            <ScrollArea>
                <Box css={{ px: "$2" }}>{children}</Box>
                <Box css={{ height: "$5", "@bp2": { height: "$8" } }} />
            </ScrollArea>
        </Box>
    );
}

function MainWrapper(props: any) {
    return (
        <Box css={{ pt: "$8", position: "relative", zIndex: 1 }}>
            <Flex css={{ flexDirection: "row" }} {...props} />
        </Box>
    );
}

const PageWrapper = styled(Box, {
    maxWidth: "100%",
    flex: 1,
    py: "$5",
    zIndex: 0,

    "@bp2": { pt: "$8", pb: "$9", pl: "250px" },
    "@media (min-width: 1440px)": { pr: "250px" },
});

function ContentWrapper(props: any) {
    return <Container size="3" css={{ maxWidth: "780px", position: "relative" }} {...props} />;
}

export function PrimitivePage({ children }: { children: React.ReactNode }) {
    const currentPageSlug = useCurrentPageSlug();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <MainWrapper>
            <NavWrapper isMobileMenuOpen={isMobileMenuOpen}>
                <NavItem href={`/`}>Apsara2.0</NavItem>
                <Box css={{ display: isSearchOpen ? "none" : undefined, mt: "$4" }}>
                    {primitivesRoutes.map((section: RouteProps) => (
                        <Box key={section.label} css={{ mb: "$4" }}>
                            <NavHeading>{section.label}</NavHeading>

                            {section.pages.map((page) => (
                                <NavItem key={page.slug} href={`/${page.slug}`} active={currentPageSlug === page.slug}>
                                    <NavItemTitle>{page.title}</NavItemTitle>
                                    {page.preview && (
                                        <Badge variant="blue" css={{ ml: "$2" }}>
                                            Preview
                                        </Badge>
                                    )}
                                    {page.deprecated && (
                                        <Badge variant="yellow" css={{ ml: "$2" }}>
                                            Deprecated
                                        </Badge>
                                    )}
                                </NavItem>
                            ))}
                        </Box>
                    ))}
                </Box>
            </NavWrapper>
            <PageWrapper>
                <ContentWrapper>{children}</ContentWrapper>
            </PageWrapper>
        </MainWrapper>
    );
}
