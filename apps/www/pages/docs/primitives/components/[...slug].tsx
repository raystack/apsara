import { Box, Flex, Heading, Link, Text } from "@odpf/apsara";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import { RemoveScroll } from "react-remove-scroll";
import { components, MDXProvider } from "~/components/mdx";
import { Toc } from "~/components/toc";
import type { Frontmatter } from "~/types/frontmatter";
import { getAllFrontmatter, getAllVersionsFromPath, getMdxBySlug } from "~/utils/mdx";

type Doc = {
    frontmatter: Frontmatter;
    code: any;
};

export default function ComponentsDoc({ frontmatter, code }: Doc) {
    const Component = React.useMemo(() => getMDXComponent(code), [code]);

    return (
        <>
            <div data-algolia-lvl0 style={{ display: "none" }}>
                Components
            </div>

            <MDXProvider frontmatter={frontmatter}>
                <>
                    <Heading
                        as="h1"
                        size="2"
                        css={{ fontWeight: 500, lineHeight: "40px" }}
                    >
                        {frontmatter.title}
                    </Heading>

                    <Text size="4" as="p" css={{ marginTop:"$2",marginBottom: "$7" }}>
                        {frontmatter.description}
                    </Text>
                    {frontmatter.radix ? (
                        <Flex gap="4">
                            {frontmatter.radix?.link && (
                                <Link
                                    href={frontmatter.radix.link}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Radix UI
                                </Link>
                            )}
                            {frontmatter.radix?.api && (
                                <Link
                                    href={frontmatter.radix.api}
                                    target="_blank"
                                    rel="noreferrer"
                                   
                                >
                                    API Reference
                                </Link>
                            )}
                        </Flex>
                    ) : null}
                </>
                <Component components={components as any} />
            </MDXProvider>

            <Box
                as="aside"
                // Components that hide the scrollbar (like Dialog) add padding to
                // account for the scrollbar gap to avoid layout jank. This does not
                // work for position: fixed elements. Since we use react-remove-scroll
                // under the hood for those primitives, we can add this helper class
                // provided by that lib to deal with that for the QuickNav.
                // https://github.com/radix-ui/website/issues/64
                // https://github.com/theKashey/react-remove-scroll#positionfixed-elements
                className={RemoveScroll.classNames.zeroRight}
                css={{
                    display: "none",
                    "@media (min-width: 1440px)": {
                        display: "block",
                        width: 250,
                        flexShrink: 0,
                        zIndex: 1,
                        position: "fixed",
                        top: "$sizes$8",
                        right: 0,
                        bottom: 0,
                    },
                }}
            >
                <Toc title={frontmatter.title}/>
            </Box>
        </>
    );
}

export async function getStaticPaths() {
    const frontmatters = getAllFrontmatter("primitives/components");
    return {
        paths: frontmatters.map((frontmatter: Frontmatter) => ({
            params: { slug: frontmatter.slug.replace("primitives/components/", "").split("/") },
        })),
        fallback: false,
    };
}

export async function getStaticProps(context: any) {
    const { frontmatter, code } = await getMdxBySlug("primitives/components/", context.params.slug.join("/"));
    const [componentName] = context.params.slug;

    const extendedFrontmatter = {
        ...frontmatter,
        versions: getAllVersionsFromPath(`primitives/components/${componentName}`),
    };

    return { props: { frontmatter: extendedFrontmatter, code } };
}
