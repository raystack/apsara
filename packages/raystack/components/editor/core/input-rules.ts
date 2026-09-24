import {
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule
} from 'prosemirror-inputrules';
import type { MarkType, Schema } from 'prosemirror-model';
import { type Plugin, TextSelection } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';

/**
 * `**x**` style rules. The pattern captures the leading boundary in group 1
 * and the text between the delimiters in group 2. The last delimiter
 * character is the one being typed, so it is not in the document yet.
 */
function markRule(
  pattern: RegExp,
  delimiter: string,
  type: MarkType
): InputRule {
  return new InputRule(pattern, (state, match, start, end) => {
    const text = match[2];
    const markStart = start + match[1].length;
    const textStart = markStart + delimiter.length;
    const textEnd = textStart + text.length;
    const tr = state.tr;
    tr.delete(textEnd, end);
    tr.delete(markStart, textStart);
    tr.addMark(markStart, markStart + text.length, type.create());
    tr.removeStoredMark(type);
    return tr;
  });
}

/** Markdown-style typing shortcuts for the formats in `schema`. */
export function buildInputRules(schema: Schema): Plugin | null {
  const { nodes, marks } = schema;
  const rules: InputRule[] = [];

  if (nodes.heading) {
    rules.push(
      textblockTypeInputRule(/^(#{1,4})\s$/, nodes.heading, match => ({
        level: match[1].length
      }))
    );
  }
  if (nodes.blockquote) {
    rules.push(wrappingInputRule(/^\s*>\s$/, nodes.blockquote));
  }
  if (nodes.taskList && nodes.taskItem) {
    const { taskList, taskItem } = nodes;
    rules.push(
      new InputRule(/^\s*\[( |x)?\]\s$/i, (state, match, start, end) => {
        const tr = state.tr.delete(start, end);
        const $start = tr.doc.resolve(start);
        const range = $start.blockRange();
        const wrapping = range && findWrapping(range, taskList);
        if (!range || !wrapping) return null;
        const checked = match[1]?.toLowerCase() === 'x';
        tr.wrap(
          range,
          wrapping.map(wrapper =>
            wrapper.type === taskItem
              ? { type: taskItem, attrs: { checked } }
              : wrapper
          )
        );
        return tr;
      })
    );
  }
  if (nodes.bulletList) {
    rules.push(wrappingInputRule(/^\s*([-+*])\s$/, nodes.bulletList));
  }
  if (nodes.orderedList) {
    rules.push(
      wrappingInputRule(
        /^(\d+)\.\s$/,
        nodes.orderedList,
        match => ({ start: Number(match[1]) }),
        (match, node) => node.childCount + node.attrs.start === Number(match[1])
      )
    );
  }
  if (nodes.codeBlock) {
    rules.push(
      textblockTypeInputRule(/^```([\w-]+)?\s$/, nodes.codeBlock, match => ({
        language: match[1] ?? null
      }))
    );
  }
  if (nodes.horizontalRule) {
    const rule = nodes.horizontalRule;
    rules.push(
      new InputRule(/^(?:---|___|\*\*\*)$/, (state, _match, start, end) => {
        const $start = state.doc.resolve(start);
        const block = $start.parent;
        if (block.type.name !== 'paragraph') return null;
        // Only a paragraph that holds nothing but the dashes.
        if (end - $start.start() !== block.content.size) return null;
        const from = $start.before();
        const to = $start.after();
        const paragraph = state.schema.nodes.paragraph.create();
        const tr = state.tr.replaceWith(from, to, [rule.create(), paragraph]);
        return tr.setSelection(TextSelection.create(tr.doc, from + 2));
      })
    );
  }

  if (marks.bold) {
    rules.push(
      markRule(/(^|\s)\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/, '**', marks.bold),
      markRule(/(^|\s)__([^_\s](?:[^_]*[^_\s])?)__$/, '__', marks.bold)
    );
  }
  if (marks.italic) {
    rules.push(
      markRule(/(^|\s)\*([^*\s](?:[^*]*[^*\s])?)\*$/, '*', marks.italic),
      markRule(/(^|\s)_([^_\s](?:[^_]*[^_\s])?)_$/, '_', marks.italic)
    );
  }
  if (marks.strike) {
    rules.push(
      markRule(/(^|\s)~~([^~\s](?:[^~]*[^~\s])?)~~$/, '~~', marks.strike)
    );
  }
  if (marks.code) {
    rules.push(markRule(/(^|\s)`([^`]+)`$/, '`', marks.code));
  }

  return rules.length ? inputRules({ rules }) : null;
}
