import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { remarkInstall } from "fumadocs-docgen";

export const docs = defineDocs({
  dir: "src/content/docs",
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [remarkInstall],
  },
});
