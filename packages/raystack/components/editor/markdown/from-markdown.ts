import {
  Marked,
  type Token,
  type TokenizerExtension,
  type Tokens
} from 'marked';
import type { EditorJSON } from '../core/json';
import { isSafeHref } from '../core/link';
import { type MentionAttrs, readMention } from '../core/mention';

type JSONMark = NonNullable<EditorJSON['marks']>[number];

interface MentionToken extends Tokens.Generic {
  type: 'mention';
  attrs: MentionAttrs;
}

/** A trigger character, then `[`. `!` is left out because `![` opens an image. */
const MENTION_START = /["-/:-@^`{-~]\[/;

const mentionExtension: TokenizerExtension = {
  name: 'mention',
  level: 'inline',
  start: source => {
    const index = source.search(MENTION_START);
    return index === -1 ? undefined : index;
  },
  tokenizer: source => {
    if (source[0] === '!') return undefined;
    const match = readMention(source, 0);
    if (!match) return undefined;
    const token: MentionToken = {
      type: 'mention',
      raw: source.slice(0, match.next),
      attrs: match.attrs
    };
    return token;
  }
};

let parser: Marked | undefined;

function lexer(): Marked {
  parser ??= new Marked({
    gfm: true,
    extensions: [mentionExtension]
  });
  return parser;
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' '
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code =
        entity[1] === 'x' || entity[1] === 'X'
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function withMark(marks: JSONMark[], mark: JSONMark): JSONMark[] {
  return marks.some(existing => existing.type === mark.type)
    ? marks
    : [...marks, mark];
}

/** Text with its marks. A soft line break becomes a hard break. */
function textNodes(text: string, marks: JSONMark[]): EditorJSON[] {
  const nodes: EditorJSON[] = [];
  text.split('\n').forEach((line, index) => {
    if (index > 0) nodes.push({ type: 'hardBreak' });
    if (line) {
      nodes.push({
        type: 'text',
        text: line,
        ...(marks.length ? { marks } : {})
      });
    }
  });
  return nodes;
}

function inline(tokens: Token[] | undefined, marks: JSONMark[]): EditorJSON[] {
  if (!tokens) return [];
  const nodes: EditorJSON[] = [];
  let underline = 0;

  for (const token of tokens) {
    const current =
      underline > 0 ? withMark(marks, { type: 'underline' }) : marks;
    switch (token.type) {
      case 'text': {
        const text = token as Tokens.Text;
        if (text.tokens?.length) nodes.push(...inline(text.tokens, current));
        else nodes.push(...textNodes(decodeEntities(text.text), current));
        break;
      }
      case 'escape':
        nodes.push(...textNodes((token as Tokens.Escape).text, current));
        break;
      case 'strong':
        nodes.push(
          ...inline(
            (token as Tokens.Strong).tokens,
            withMark(current, { type: 'bold' })
          )
        );
        break;
      case 'em':
        nodes.push(
          ...inline(
            (token as Tokens.Em).tokens,
            withMark(current, { type: 'italic' })
          )
        );
        break;
      case 'del':
        nodes.push(
          ...inline(
            (token as Tokens.Del).tokens,
            withMark(current, { type: 'strike' })
          )
        );
        break;
      case 'codespan':
        nodes.push(
          ...textNodes(
            decodeEntities((token as Tokens.Codespan).text),
            withMark(current, { type: 'code' })
          )
        );
        break;
      case 'link': {
        const link = token as Tokens.Link;
        const next = isSafeHref(link.href)
          ? withMark(current, { type: 'link', attrs: { href: link.href } })
          : current;
        nodes.push(...inline(link.tokens, next));
        break;
      }
      case 'br':
        nodes.push({ type: 'hardBreak' });
        break;
      case 'image':
        nodes.push(...textNodes((token as Tokens.Image).text, current));
        break;
      case 'mention':
        nodes.push({
          type: 'mention',
          attrs: { ...(token as MentionToken).attrs }
        });
        break;
      case 'html': {
        // `<u>` is the only HTML read as formatting. Other HTML stays text
        // and is never rendered.
        const html = (token as Tokens.HTML).text.trim().toLowerCase();
        if (html === '<u>') underline += 1;
        else if (html === '</u>') underline = Math.max(0, underline - 1);
        else nodes.push(...textNodes((token as Tokens.HTML).text, current));
        break;
      }
      default:
        if ('text' in token && typeof token.text === 'string') {
          nodes.push(...textNodes(token.text, current));
        }
    }
  }
  return nodes;
}

function paragraph(content: EditorJSON[]): EditorJSON {
  return content.length
    ? { type: 'paragraph', content }
    : { type: 'paragraph' };
}

/** List item content has to start with a paragraph. */
function itemContent(tokens: Token[]): EditorJSON[] {
  const content = blocks(tokens.filter(token => token.type !== 'checkbox'));
  if (content[0]?.type !== 'paragraph') content.unshift(paragraph([]));
  return content;
}

function list(token: Tokens.List): EditorJSON {
  if (token.items.some(item => item.task)) {
    return {
      type: 'taskList',
      content: token.items.map(item => ({
        type: 'taskItem',
        attrs: { checked: item.checked === true },
        content: itemContent(item.tokens)
      }))
    };
  }
  const items = token.items.map(item => ({
    type: 'listItem',
    content: itemContent(item.tokens)
  }));
  if (!token.ordered) return { type: 'bulletList', content: items };
  const start = typeof token.start === 'number' ? token.start : 1;
  return { type: 'orderedList', attrs: { start }, content: items };
}

function blocks(tokens: Token[]): EditorJSON[] {
  const nodes: EditorJSON[] = [];
  for (const token of tokens) {
    switch (token.type) {
      case 'space':
      case 'def':
        break;
      case 'heading': {
        const heading = token as Tokens.Heading;
        const content = inline(heading.tokens, []);
        nodes.push({
          type: 'heading',
          attrs: { level: Math.min(heading.depth, 4) },
          ...(content.length ? { content } : {})
        });
        break;
      }
      case 'paragraph':
        nodes.push(paragraph(inline((token as Tokens.Paragraph).tokens, [])));
        break;
      case 'text': {
        const text = token as Tokens.Text;
        nodes.push(
          paragraph(
            text.tokens
              ? inline(text.tokens, [])
              : textNodes(decodeEntities(text.text), [])
          )
        );
        break;
      }
      case 'code': {
        const code = token as Tokens.Code;
        nodes.push({
          type: 'codeBlock',
          attrs: { language: code.lang?.split(/\s/)[0] || null },
          ...(code.text ? { content: [{ type: 'text', text: code.text }] } : {})
        });
        break;
      }
      case 'hr':
        nodes.push({ type: 'horizontalRule' });
        break;
      case 'blockquote': {
        const content = blocks((token as Tokens.Blockquote).tokens);
        nodes.push({
          type: 'blockquote',
          content: content.length ? content : [paragraph([])]
        });
        break;
      }
      case 'list':
        nodes.push(list(token as Tokens.List));
        break;
      case 'table': {
        const table = token as Tokens.Table;
        const rows = [table.header, ...table.rows];
        for (const row of rows) {
          nodes.push(
            paragraph(textNodes(row.map(cell => cell.text).join(' | '), []))
          );
        }
        break;
      }
      case 'html':
        nodes.push(
          paragraph(textNodes((token as Tokens.HTML).text.trim(), []))
        );
        break;
      default:
        if ('text' in token && typeof token.text === 'string') {
          nodes.push(paragraph(textNodes(token.text, [])));
        }
    }
  }
  return nodes;
}

/** Parses Markdown into editor JSON. */
export function fromMarkdown(markdown: string): EditorJSON {
  const content = blocks(lexer().lexer(markdown));
  return { type: 'doc', content: content.length ? content : [paragraph([])] };
}
