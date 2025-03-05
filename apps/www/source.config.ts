import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { remarkInstall } from "fumadocs-docgen";
import { remarkAutoTypeTable } from "fumadocs-typescript";

export const docs = defineDocs({
  dir: "src/content/docs",
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkInstall, remarkAutoTypeTable],
  },
});
