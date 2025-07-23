import { TagSchema } from '@/lib/types';
import { remarkInstall } from 'fumadocs-docgen';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema
} from 'fumadocs-mdx/config';
import { createGenerator, remarkAutoTypeTable } from 'fumadocs-typescript';

const generator = createGenerator();

export const docs = defineDocs({
  dir: 'src/content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      tag: TagSchema
    })
  }
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkInstall, [remarkAutoTypeTable, { generator }]]
  }
});
