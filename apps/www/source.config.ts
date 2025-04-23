import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { remarkInstall } from "fumadocs-docgen";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { TagSchema } from "@/lib/types";

export const docs = defineDocs({
  dir: "src/content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      tag: TagSchema,
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkInstall, remarkAutoTypeTable],
  },
});
