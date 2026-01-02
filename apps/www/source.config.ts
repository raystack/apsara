import * as path from 'node:path';
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
import {
  createGenerator,
  GeneratorOptions,
  remarkAutoTypeTable
} from 'fumadocs-typescript';
import { fileURLToPath } from 'url';
import { SourceSchema, TagSchema } from '@/lib/types';

const relative = (s: string): string =>
  path.resolve(fileURLToPath(new URL(s, import.meta.url)));

const tsconfig: GeneratorOptions = {
  tsconfigPath: relative('../tsconfig.json'),
  basePath: relative('../'),
  cache: false
};

const generator = createGenerator(tsconfig);

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
        [remarkAutoTypeTable, { generator }]
      ];
    },
    rehypePlugins: () => [rehypeToc]
  }
});
