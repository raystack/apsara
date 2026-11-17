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
  types?: SourceNode[];
  typeName?: SourceNode;
  objectType?: SourceNode;
  exprName?: SourceNode;
  expression?: SourceNode;
  elements?: SourceNode[];
  jsDoc?: {
    comment?: unknown;
    tags?: { tagName: { text: string }; comment?: unknown }[];
  }[];
  getText(): string;
  getSourceFile(): { fileName: string };
}

interface TypeSymbol {
  flags: number;
  declarations: readonly { resolve(program: unknown): unknown }[];
  getDocumentationComment(checker: Checker): string;
}

interface Checker {
  getTypeAtLocation(node: SourceNode): unknown;
  getPropertiesOfType(
    type: unknown
  ): readonly (TypeSymbol & { name: string })[];
  getSymbolAtLocation(node: SourceNode): TypeSymbol | undefined;
  getAliasedSymbol(symbol: TypeSymbol): TypeSymbol;
}

// The transform cannot remove an entry, so it marks the entries to hide and
// the generator drops them.
const hidden = new WeakSet<DocEntry>();

const base = createGenerator({
  tsconfigPath: path.resolve('tsconfig.props.json')
});

const APSARA = path.resolve('../../packages/react/index.tsx');

// Helpers that a `type` expression can use. `AllProps<T>` lists the props of
// every branch of a union, and a prop that some branches lack is optional.
const HELPERS = `import type { ComponentProps } from 'react';
type OmitEach<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type Intersect<U> = (U extends unknown ? (u: U) => void : never) extends (u: infer I) => void ? I : never;
type AllProps<T> = T & Partial<Intersect<OmitEach<T, keyof T>>>;`;

const GLOBALS = new Set([
  'AllProps',
  'ComponentProps',
  'Exclude',
  'Extract',
  'Function',
  'NonNullable',
  'Omit',
  'Parameters',
  'Partial',
  'Pick',
  'ReturnType'
]);

/**
 * A table without `path` reads the `@raystack/apsara` entry. `name` is an
 * exported type, for example `ButtonProps`. `type` can use the exported
 * components and types, for example `ComponentProps<typeof Dialog.Trigger>`
 * or `AllProps<TourEvent>`.
 */
function apsaraTable(
  props: Parameters<typeof base.generateTypeTable>[0]
): Parameters<typeof base.generateTypeTable>[0] {
  if (!props.type) return { ...props, path: APSARA };
  const names = new Set(
    Array.from(
      props.type.matchAll(
        /'[^']*'|"[^"]*"|\btypeof (\w+)|(?<![.\w])([A-Z]\w*)/g
      ),
      match => match[1] ?? match[2]
    ).filter(name => name && !GLOBALS.has(name))
  );
  // The imports take a `$` prefix, so the table can share a name with one,
  // as in `TourEvent = AllProps<TourEvent>`.
  const type = props.type.replace(
    /'[^']*'|"[^"]*"|(?<![.\w])(\w+)/g,
    (match, name?: string) => (name && names.has(name) ? `$${name}` : match)
  );
  const imports = [...names].map(name => `${name} as $${name}`).join(', ');
  return {
    name: props.name,
    type: [
      HELPERS,
      `import type { ${imports} } from '@raystack/apsara';`,
      `export type ${props.name} = ${type};`
    ].join('\n')
  };
}

// `generateTypeTable` calls `this.generateDocumentation`, so it runs this
// filter. A cache would store the entries before the filter, so it stays off.
export const generator: typeof base = {
  ...base,
  async generateDocumentation(...args) {
    const docs = await base.generateDocumentation(...args);
    return docs.map(doc => ({
      ...doc,
      entries: doc.entries.filter(entry => !hidden.has(entry))
    }));
  },
  generateTypeTable(props, options) {
    if (props.path) return base.generateTypeTable.call(this, props, options);
    return base.generateTypeTable.call(this, apsaraTable(props), {
      ...options,
      basePath: undefined
    });
  }
};

const isExternal = (node: SourceNode) =>
  node.getSourceFile().fileName.includes('/node_modules/');

// Calendar's props extend those of react-day-picker's DayPicker.
const SHOWN_PACKAGES = [
  '/node_modules/@base-ui/',
  '/node_modules/react-day-picker/'
];

/** A prop is shown when Apsara, Base UI or react-day-picker declares it. */
const isShown = (file: string) =>
  !file.includes('/node_modules/') ||
  SHOWN_PACKAGES.some(dir => file.includes(dir));

const shortTypes: Record<string, string> = {
  className: 'string',
  style: 'CSSProperties | function',
  render: 'ReactElement | function'
};

/** A type name, or a union of names and literals such as `"solid" | "outline"`. */
const SHORT =
  /^(?:[\w.]+(?:\[\])?|"[^"]*"|-?\d+(?:\.\d+)?)(?: \| (?:[\w.]+(?:\[\])?|"[^"]*"|-?\d+(?:\.\d+)?))*$/;

const withoutUndefined = (type: string) => type.replace(/ \| undefined$/, '');

const normalize = (text: string) =>
  text
    .replace(/\s+/g, ' ')
    .replace(/^\| /, '')
    .replace(/'([^']*)'/g, '"$1"');

/** The type as written in the source, which keeps the order of a union. */
function writtenType(node: SourceNode | undefined): string | undefined {
  const text = node?.type && normalize(node.type.getText());
  return text && withoutUndefined(text);
}

/** The members of a written union, outside brackets and generics. */
function unionMembers(text: string): string[] {
  const members: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if ('([{<'.includes(char)) depth++;
    else if (')]}>'.includes(char) && text[index - 1] !== '=') depth--;
    else if (char === '|' && depth === 0) {
      members.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  members.push(text.slice(start).trim());
  return members.filter(Boolean);
}

const SYMBOL_ALIAS = 2097152;

/** The declaration of the symbol at a node, through imports. */
function declarationOf(
  node: SourceNode | undefined,
  checker: Checker,
  program: unknown
): SourceNode | undefined {
  if (!node) return;
  let symbol = checker.getSymbolAtLocation(node);
  if (symbol && symbol.flags & SYMBOL_ALIAS)
    symbol = checker.getAliasedSymbol(symbol);
  return symbol?.declarations[0]?.resolve(program) as SourceNode | undefined;
}

const isLiteralUnion = (text: string) => SHORT.test(text) && /["\d]/.test(text);

/**
 * The written members of a declared type, without `undefined` and `never`. A
 * member that names an alias of literals, such as `Align`, shows the literals.
 */
function writtenMembers(
  node: SourceNode | undefined,
  checker: Checker,
  program: unknown,
  depth = 0
): string[] {
  const type = node?.type;
  if (!type) return [];
  const parts =
    unionMembers(normalize(type.getText())).length > 1 && type.types
      ? type.types
      : [type];
  return parts
    .flatMap(part => {
      const text = normalize(part.getText());
      if (depth < 4 && part.typeName && /^[\w.]+$/.test(text)) {
        const expanded = expandReference(part, checker, program, depth);
        if (expanded && isLiteralUnion(expanded)) return unionMembers(expanded);
      }
      // `FlexProps["justify"]` shows the type of `justify` in `FlexProps`.
      const property = depth < 4 ? indexedProperty(part, checker) : undefined;
      if (property) {
        const nodes = property.declarations.flatMap(declaration => {
          const node = declaration.resolve(program) as SourceNode | undefined;
          return node ? [node] : [];
        });
        const expanded = propType(nodes, checker, program, depth + 1);
        if (expanded && SHORT.test(expanded)) return unionMembers(expanded);
      }
      return unionMembers(text);
    })
    .filter(member => member !== 'undefined' && member !== 'never');
}

/** The property that an indexed access such as `FlexProps["justify"]` names. */
function indexedProperty(part: SourceNode, checker: Checker) {
  const match = /^[\w.]+\["([\w-]+)"\]$/.exec(normalize(part.getText()));
  if (!match || !part.objectType) return;
  return checker
    .getPropertiesOfType(checker.getTypeAtLocation(part.objectType))
    .find(symbol => symbol.name === match[1]);
}

/**
 * The written type of a prop from its declarations. The branches of a union
 * each declare the prop, and a branch that blocks it declares `never`. A cva
 * variant has no written type, so it shows the keys of its object of classes,
 * in order.
 */
function propType(
  nodes: SourceNode[],
  checker: Checker,
  program: unknown,
  depth = 0
): string | undefined {
  const members = [
    ...new Set(
      nodes
        .filter(node => node.type)
        .flatMap(node => writtenMembers(node, checker, program, depth))
    )
  ];
  let written = members.length > 0 ? members.join(' | ') : undefined;
  if (written === 'false | true' || written === 'true | false')
    written = 'boolean';
  if (written && SHORT.test(written)) return written;
  const variant = nodes.find(node => node.initializer)?.initializer;
  const keys = variant
    ? checker
        .getPropertiesOfType(checker.getTypeAtLocation(variant))
        .map(key => key.name)
    : [];
  if (keys.length > 0 && !keys.includes('true'))
    return keys.map(key => (/^\d+$/.test(key) ? key : `"${key}"`)).join(' | ');
  return written;
}

/**
 * The written type behind a reference to an alias. It reads the array of an
 * alias such as `(typeof RADII)[number]`.
 */
function expandReference(
  reference: SourceNode,
  checker: Checker,
  program: unknown,
  depth: number
): string | undefined {
  const alias = declarationOf(reference.typeName, checker, program);
  if (/^\(typeof \w+\)\[number\]$/.test(writtenType(alias) ?? '')) {
    const array = declarationOf(
      alias?.type?.objectType?.type?.exprName,
      checker,
      program
    );
    return arrayValues(array, checker, program).join(' | ');
  }
  return writtenMembers(alias, checker, program, depth + 1).join(' | ');
}

/** The values of a constant array such as `['none', 'small'] as const`. */
function arrayValues(
  variable: SourceNode | undefined,
  checker: Checker,
  program: unknown,
  depth = 0
): string[] {
  let list = variable?.initializer;
  // Unwrap `as const`.
  while (list && !list.elements && list.expression) list = list.expression;
  return (list?.elements ?? []).flatMap(element =>
    element.expression && depth < 4
      ? arrayValues(
          declarationOf(element.expression, checker, program),
          checker,
          program,
          depth + 1
        )
      : [element.getText().replace(/^'(.*)'$/, '"$1"')]
  );
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
  // Every component takes `className`, so its row stays when only React
  // declares it.
  const shown = entry.name === 'className' || files.some(isShown);
  if (!shown || entry.tags.some(tag => tag.name === 'ignore')) {
    hidden.add(entry);
    return;
  }

  // A prop that Base UI also declares keeps only the Apsara JSDoc. A prop of a
  // union, such as `multiple` in `{ multiple?: false } | { multiple: true }`,
  // shows the JSDoc of its branches once. A part that redeclares a cva
  // variant, such as `justify?: FlexProps['justify']` with its own
  // `@default`, keeps the variant's description unless it sets its own.
  const own = declarations.filter(
    node => !isExternal(node) && (node.jsDoc?.length ?? 0) > 0
  );
  if (own.length > 1 || (own.length > 0 && own.length < declarations.length)) {
    const variants = own.filter(node => node.initializer);
    const redeclared = own.filter(node => !node.initializer);
    const docsOf = (nodes: SourceNode[]) =>
      nodes.flatMap(node => node.jsDoc ?? []);
    const texts = (nodes: SourceNode[]) => [
      ...new Set(
        docsOf(nodes)
          .map(doc => commentText(doc.comment))
          .filter(Boolean)
      )
    ];
    const description = texts(redeclared);
    entry.description = (
      description.length > 0 ? description : texts(variants)
    ).join('\n');
    // A tag of a redeclaration wins over the same tag of a variant.
    const tags = new Map<string, RawTag>();
    for (const doc of [...docsOf(variants), ...docsOf(redeclared)])
      for (const tag of doc.tags ?? [])
        tags.set(tag.tagName.text, {
          name: tag.tagName.text,
          text: commentText(tag.comment)
        });
    entry.tags = [...tags.values()];
    entry.deprecated = tags.has('deprecated');
  }

  // A prop typed as `FlexProps["align"]`, with only a `@default` of its own,
  // shows the description of `align` in `FlexProps`.
  const checker = this.checker as unknown as Checker;
  if (!entry.description) {
    const property = declarations
      .map(node => node.type && indexedProperty(node.type, checker))
      .find(Boolean);
    if (property) entry.description = property.getDocumentationComment(checker);
  }

  // Apsara merges `className` with its own classes, which drops a function.
  // So a `className` that only Base UI or React declares shows a string.
  if (entry.name === 'className' && own.length === 0) {
    entry.description = 'CSS class applied to the element.';
    entry.type = entry.required ? 'string' : 'string | undefined';
  }

  // A part documents `children` only when it has something to say.
  if (entry.name === 'children' && !entry.description) {
    hidden.add(entry);
    return;
  }

  const deprecation = entry.tags.find(tag => tag.name === 'deprecated')?.text;
  if (deprecation)
    entry.description = [entry.description, deprecation]
      .filter(Boolean)
      .join(' ');

  // An Apsara declaration of the prop wins over one from Base UI or React,
  // even a cva variant with no written type.
  const apsara = declarations.filter(node => !isExternal(node));
  const library = declarations.filter(node =>
    isShown(node.getSourceFile().fileName)
  );
  const written = propType(
    apsara.length > 0
      ? apsara
      : library.length > 0
        ? library
        : declarations.slice(0, 1),
    checker,
    this.program
  );
  // cva adds `null` to a variant.
  if (declarations.some(node => node.initializer))
    entry.type = entry.type.replace(/ \| null\b/, '');
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
