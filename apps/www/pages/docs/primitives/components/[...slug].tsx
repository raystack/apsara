import { Flex, Headline, Link, Text } from "@odpf/apsara";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import { components, MDXProvider } from "~/components/markdown/mdx";
import { PrimitivePage } from "~/components/primitive-page";
import type { Frontmatter } from "~/types/frontmatter";
import {
  getAllFrontmatter,
  getAllVersionsFromPath,
  getMdxBySlug,
} from "~/utils/mdx";

type Doc = {
  frontmatter: Frontmatter;
  code: any;
};

export default function ComponentsDoc({ frontmatter, code }: Doc) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <PrimitivePage frontmatter={frontmatter}>
      <MDXProvider frontmatter={frontmatter}>
        <>
          <Headline
            size="medium"
            style={{ fontWeight: "bold", lineHeight: "52px" }}
          >
            {frontmatter.title}
          </Headline>

          <Text size={4} style={{ marginTop: "8px", marginBottom: "32px" }}>
            {frontmatter.description}
          </Text>
          {frontmatter.radix ? (
            <Flex gap="small">
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
    </PrimitivePage>
  );
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter("primitives/components");
  return {
    paths: frontmatters.map((frontmatter: Frontmatter) => ({
      params: {
        slug: frontmatter.slug.replace("primitives/components/", "").split("/"),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const { frontmatter, code } = await getMdxBySlug(
    "primitives/components/",
    context.params.slug.join("/")
  );
  const [componentName] = context.params.slug;

  const extendedFrontmatter = {
    ...frontmatter,
    versions: getAllVersionsFromPath(`primitives/components/${componentName}`),
  };

  return { props: { frontmatter: extendedFrontmatter, code } };
}
