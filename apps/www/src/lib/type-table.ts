import * as path from 'node:path';
import { createGenerator, type GenerateOptions } from 'fumadocs-typescript';

type Transform = NonNullable<GenerateOptions['transform']>;

export const generator = createGenerator({
  tsconfigPath: path.resolve('tsconfig.props.json')
});

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
function writtenType(node: unknown): string | undefined {
  const type = (node as { type?: { getText(): string } } | undefined)?.type;
  const text = type
    ?.getText()
    .replace(/\s+/g, ' ')
    .replace(/^\| /, '')
    .replace(/'([^']*)'/g, '"$1"');
  return text && withoutUndefined(text);
}

/** Sets the short type of a table row. The expanded row shows the full type. */
export const transform: Transform = function (entry, _type, prop) {
  // A `@remarks` type set by the author wins.
  if (entry.tags.some(tag => tag.name === 'remarks' && tag.text[0] === '`'))
    return;

  const written = writtenType(prop.declarations?.[0]?.resolve(this.program));
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
