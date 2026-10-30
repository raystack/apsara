import { type GeneratedDoc, typeTableToMarkdown } from 'fumadocs-typescript';
import type { Parent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

interface MdxJsxAttributeLike {
  type: 'mdxJsxAttribute';
  name: string;
  value?: { value?: string } | string | null;
}

interface MdxJsxFlowElementLike {
  name: string | null;
  attributes: Array<
    MdxJsxAttributeLike | { type: 'mdxJsxExpressionAttribute' }
  >;
}

/** Replaces each generated `TypeTable` with its props table in Markdown. */
export function remarkTypeTableToMd() {
  return (tree: Root) => {
    visit(
      tree,
      'mdxJsxFlowElement',
      (
        node: MdxJsxFlowElementLike,
        index: number | undefined,
        parent: Parent | undefined
      ) => {
        if (node.name !== 'TypeTable' || !parent || typeof index !== 'number')
          return;

        const typeProp = node.attributes.find(
          (attr): attr is MdxJsxAttributeLike =>
            attr.type === 'mdxJsxAttribute' && attr.name === 'type'
        );
        const value = typeProp?.value;
        if (!value || typeof value === 'string' || !value.value) return;

        const doc = JSON.parse(value.value) as GeneratedDoc;
        // `typeTableToMarkdown` prints `simplifiedType`, which is the short
        // label such as `function`. The LLM text gets the full type.
        const entries = doc.entries.map(entry => ({
          ...entry,
          simplifiedType: entry.type
            .replace(/\s+/g, ' ')
            .replace(/ \| undefined$/, '')
        }));
        parent.children.splice(index, 1, {
          type: 'html',
          value: typeTableToMarkdown({ ...doc, entries })
        });
      }
    );
  };
}
