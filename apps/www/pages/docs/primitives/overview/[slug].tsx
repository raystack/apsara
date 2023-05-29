// import { QuickNav } from "@components/QuickNav";

import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import { components, MDXProvider } from "~/components/mdx";
import { PrimitivePage } from "~/components/primitive-page";

import type { Frontmatter } from "~/types/frontmatter";
import { getAllFrontmatter, getMdxBySlug } from "~/utils/mdx";

type Doc = {
    frontmatter: Frontmatter;
    code: string;
};

export default function OverviewDoc({ frontmatter, code }: Doc) {
    const Component = React.useMemo(() => getMDXComponent(code), [code]);

    return (
        <PrimitivePage frontmatter={frontmatter}>
            <MDXProvider frontmatter={frontmatter}>
                <Component components={components as any} />
            </MDXProvider>
        </PrimitivePage>
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
