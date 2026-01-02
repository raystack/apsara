import { LoaderPlugin, loader } from 'fumadocs-core/source';
import { docs as RAW_DOCS } from '@/.source';
import { TagType } from './types';

export const docs = loader({
  baseUrl: '/docs',
  source: RAW_DOCS.toFumadocsSource(),
  plugins: [addFrontmatterToPageTree()]
});

function addFrontmatterToPageTree(): LoaderPlugin {
  return {
    transformPageTree: {
      file(node, file) {
        const data = this.storage.read(file as string);
        const frontmatter = data?.data as Record<string, unknown> | undefined;
        const tag: TagType = (frontmatter?.tag as TagType) ?? undefined;
        return { ...node, tag };
      }
    }
  };
}
