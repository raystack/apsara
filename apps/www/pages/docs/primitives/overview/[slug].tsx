// import { QuickNav } from "@components/QuickNav";

import { Box } from "@odpf/apsara";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import { RemoveScroll } from "react-remove-scroll";
import { components, MDXProvider } from "~/components/mdx";
import { Toc } from "~/components/toc";

import type { Frontmatter } from "~/types/frontmatter";
import { getAllFrontmatter, getMdxBySlug } from "~/utils/mdx";

type Doc = {
    frontmatter: Frontmatter;
    code: string;
};

export default function OverviewDoc({ frontmatter, code }: Doc) {
    const Component = React.useMemo(() => getMDXComponent(code), [code]);

    return (
        <>
            <MDXProvider frontmatter={frontmatter}>
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
                <Toc />
            </Box>
        </>
    );
}

export async function getStaticPaths() {
    const frontmatters = getAllFrontmatter("primitives/overview");

    return {
        paths: frontmatters.map((frontmatter: Frontmatter) => ({
            params: { slug: frontmatter.slug.replace("primitives/overview/", "") },
        })),
        fallback: false,
    };
}

export async function getStaticProps(context: any) {
    const { frontmatter, code } = await getMdxBySlug("primitives/overview/", context.params.slug);
    return { props: { frontmatter, code } };
}
