import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { remarkInstall } from 'fumadocs-docgen';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from 'fumadocs-mdx/config';
import {
  GeneratorOptions,
  createGenerator,
  remarkAutoTypeTable
} from 'fumadocs-typescript';

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
    schema: frontmatterSchema,
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
    remarkPlugins: [remarkInstall, [remarkAutoTypeTable, { generator }]]
  }
});
