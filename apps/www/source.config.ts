import {
  rehypeToc,
  remarkGfm,
  remarkHeading,
  remarkImage,
  remarkNpm,
  remarkStructure
} from 'fumadocs-core/mdx-plugins';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from 'fumadocs-mdx/config';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { generator, transform } from '@/lib/type-table';
import { SourceSchema, TagSchema } from '@/lib/types';

export const docs = defineDocs({
  dir: 'src/content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      source: SourceSchema,
      tag: TagSchema
    }),
    postprocess: {
      includeProcessedMarkdown: true
    }
  },
  meta: {
    schema: metaSchema
  }
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: () => {
      return [
        remarkGfm,
        [remarkHeading, { generateToc: false }],
        [remarkImage, { useImport: undefined }],
        // remarkCodeTab,
        remarkNpm,
        remarkStructure,
        // remarkInstall,
        [remarkAutoTypeTable, { generator, options: { transform } }]
      ];
    },
    rehypePlugins: () => [rehypeToc]
  }
});
