import {
  Box,
  Flex,
  Link,
  ScrollArea,
  Text,
  useApsaraTheme,
} from "@raystack/ui";
import { useRouter } from "next/router";
import { MutableRefObject, useRef } from "react";
import type { Frontmatter } from "~/types/frontmatter";
import { PageProps, primitivesRoutes } from "~/utils/routes";
import styles from "./page.module.css";
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
    <Text size={3} style={{ fontWeight: 500, margin: "12px" }} {...props}>
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
    <Box>
      <Box
        {...props}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2px",
          borderRadius: "var(--br-4)",
          backgroundColor: active ? "var(--clr-bg-base-hover)" : "transparent",
          transition: "background-color 50ms linear",
          ...(disabled ? { pointerEvents: "none" } : {}),
        }}
      >
        <Link
          href={href}
          style={{
            textDecoration: "none",
            padding: "12px 16px",
            width: "100%",
            color: "var(--clr-fg-base)",
          }}
        >
          <Text size={3} style={{ fontWeight: active ? "500" : "none" }}>
            {children}
          </Text>
        </Link>
      </Box>
    </Box>
  );
}

export function NavItemTitle({ children, active }: any) {
  return (
    <Text size={3} style={{ fontWeight: active ? "500" : "none" }}>
      {children}
    </Text>
  );
}

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
      <Flex style={{ height: "calc(100vh - 73px)" }}>
        <Flex
          style={{
            display: "block",

            position: "relative",
            height: "100%",
            width: "100%",
            maxWidth: "260px",
            overflow: "hidden",
            borderRight: "1px solid var(--clr-border-base)",
          }}
        >
          <LeftSideBar />
        </Flex>
        <div
          style={{
            height: "calc(100vh - 73px)",
            width: "100%",
          }}
        >
          <Flex style={{ overflowY: "scroll", width: "100%", height: "100%" }}>
            <Flex direction="column" className={styles.content}>
              {children}
              <div style={{ height: "60px" }}></div>
            </Flex>

            <RightSideBar
              frontmatter={frontmatter}
              containerElm={containerElm}
            />
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
}

const LeftSideBar = () => {
  const currentPageSlug = useCurrentPageSlug();
  const [overviews, components] = primitivesRoutes;

  return (
    <ScrollArea>
      <Box style={{ padding: "var(--mr-16)" }}>
        <Box key={overviews.label} style={{ marginBottom: "var(--mr-4)" }}>
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
        <Box key={components.label} style={{ marginBottom: "var(--mr-4)" }}>
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
      style={{
        width: "260px",
        display: "block",
        position: "sticky",
        top: 0,
      }}
    >
      <ScrollArea>
        <Toc title={frontmatter.title} containerElm={containerElm} />
      </ScrollArea>
    </Box>
  );
};
