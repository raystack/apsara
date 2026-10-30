import * as path from 'node:path';
import {
  createGenerator,
  type DocEntry,
  type GenerateOptions,
  type RawTag
} from 'fumadocs-typescript';

type Transform = NonNullable<GenerateOptions['transform']>;

// The declaration nodes come from the TypeScript 7 in fumadocs-typescript.
// apps/www has TypeScript 5, so the transform reads them through these shapes.
interface SourceNode {
  parent?: SourceNode;
  name?: { text?: string };
  properties?: SourceNode[];
  initializer?: SourceNode;
  type?: SourceNode;
  jsDoc?: {
    comment?: unknown;
    tags?: { tagName: { text: string }; comment?: unknown }[];
  }[];
  getText(): string;
  getSourceFile(): { fileName: string };
}

interface Checker {
  getTypeAtLocation(node: SourceNode): unknown;
  getPropertiesOfType(type: unknown): readonly { name: string }[];
}

// The transform cannot remove an entry, so it marks the entries to hide and
// the generator drops them.
const hidden = new WeakSet<DocEntry>();

const base = createGenerator({
  tsconfigPath: path.resolve('tsconfig.props.json')
});

export const generator: typeof base = {
  ...base,
  async generateDocumentation(...args) {
    const docs = await base.generateDocumentation(...args);
    return docs.map(doc => ({
      ...doc,
      entries: doc.entries.filter(entry => !hidden.has(entry))
    }));
  }
};

const isExternal = (node: SourceNode) =>
  node.getSourceFile().fileName.includes('/node_modules/');

/** A prop is shown when Apsara or Base UI declares it. */
const isShown = (file: string) =>
  !file.includes('/node_modules/') || file.includes('/node_modules/@base-ui/');

const shortTypes: Record<string, string> = {
  className: 'string | function',
  style: 'CSSProperties | function',
  render: 'ReactElement | function'
};

/** A type name, or a union of names and literals such as `"solid" | "outline"`. */
const SHORT =
  /^(?:[\w.]+(?:\[\])?|"[^"]*"|-?\d+(?:\.\d+)?)(?: \| (?:[\w.]+(?:\[\])?|"[^"]*"|-?\d+(?:\.\d+)?))*$/;

const withoutUndefined = (type: string) => type.replace(/ \| undefined$/, '');

/** The type as written in the source, which keeps the order of a union. */
function writtenType(node: SourceNode | undefined): string | undefined {
  const text = node?.type
    ?.getText()
    .replace(/\s+/g, ' ')
    .replace(/^\| /, '')
    .replace(/'([^']*)'/g, '"$1"');
  return text && withoutUndefined(text);
}

function commentText(comment: unknown): string {
  if (typeof comment === 'string') return comment;
  if (!Array.isArray(comment)) return '';
  return comment.map(part => (part as { text?: string }).text ?? '').join('');
}

/** The value of a cva variant in `defaultVariants`, for example `"solid"`. */
function cvaDefault(node: SourceNode, prop: string): string | undefined {
  const variants = node.parent?.parent;
  if (variants?.name?.text !== 'variants') return;
  const defaults = variants.parent?.properties?.find(
    property => property.name?.text === 'defaultVariants'
  );
  const value = defaults?.initializer?.properties?.find(
    property => property.name?.text === prop
  );
  return value?.initializer?.getText().replace(/^'(.*)'$/, '"$1"');
}

/**
 * Hides the props that a table leaves out, and sets the description, default
 * and short type of the others.
 */
export const transform: Transform = function (entry, _type, prop) {
  const declarations = (prop.declarations ?? []).flatMap(declaration => {
    const node = declaration.resolve(this.program);
    return node ? [node as unknown as SourceNode] : [];
  });
  const files = declarations.map(node => node.getSourceFile().fileName);
  if (!files.some(isShown) || entry.tags.some(tag => tag.name === 'ignore')) {
    hidden.add(entry);
    return;
  }

  // A prop that Base UI also declares keeps only the Apsara JSDoc.
  const own = declarations.filter(
    node => !isExternal(node) && (node.jsDoc?.length ?? 0) > 0
  );
  if (own.length > 0 && own.length < declarations.length) {
    const docs = own.flatMap(node => node.jsDoc ?? []);
    entry.description = docs.map(doc => commentText(doc.comment)).join('\n');
    entry.tags = docs.flatMap(doc =>
      (doc.tags ?? []).map(
        (tag): RawTag => ({
          name: tag.tagName.text,
          text: commentText(tag.comment)
        })
      )
    );
    entry.deprecated = entry.tags.some(tag => tag.name === 'deprecated');
  }

  const deprecation = entry.tags.find(tag => tag.name === 'deprecated')?.text;
  if (deprecation)
    entry.description = [entry.description, deprecation]
      .filter(Boolean)
      .join(' ');

  // An Apsara declaration of the prop wins over one from Base UI.
  let written = writtenType(
    declarations.find(node => node.type && !isExternal(node)) ?? declarations[0]
  );
  // A cva variant has no written type, and cva adds `null` to it. Its values
  // keep the order of the variant's keys.
  if (!written) {
    entry.type = entry.type.replace(/ \| null\b/, '');
    const variant = declarations.find(node => node.initializer)?.initializer;
    const checker = this.checker as unknown as Checker;
    const keys = variant
      ? checker
          .getPropertiesOfType(checker.getTypeAtLocation(variant))
          .map(key => key.name)
      : [];
    if (keys.length > 0 && !keys.includes('true'))
      written = keys
        .map(key => (/^\d+$/.test(key) ? key : `"${key}"`))
        .join(' | ');
  }
  if (!entry.tags.some(tag => ['default', 'defaultValue'].includes(tag.name))) {
    const value = declarations
      .map(node => cvaDefault(node, entry.name))
      .find(Boolean);
    if (value) entry.tags.push({ name: 'default', text: value });
  }

  // A `@remarks` type set by the author wins.
  if (entry.tags.some(tag => tag.name === 'remarks' && tag.text[0] === '`'))
    return;

  const type = (written ?? withoutUndefined(entry.type)).replace(
    /\bReact\./g,
    ''
  );
  if (written && SHORT.test(type))
    entry.type = entry.required ? type : `${type} | undefined`;

  if (
    SHORT.test(type) ||
    entry.name === 'children' ||
    entry.name === 'ref' ||
    entry.name.endsWith('Ref')
  )
    entry.simplifiedType = type;
  else if (shortTypes[entry.name])
    entry.simplifiedType = shortTypes[entry.name];
  else if (/^(on|get)[A-Z]/.test(entry.name)) entry.simplifiedType = 'function';
  else if (/ & |<.*\b(object|union)\b/.test(entry.simplifiedType))
    entry.simplifiedType = 'object';
};
