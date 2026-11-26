import { isValidElement, type ReactNode } from 'react';
import type { TypeNode } from './typetable';

// remarkAutoTypeTable passes each type as a fragment around its text.
export function toText(node: ReactNode): string {
  if (isValidElement<{ children?: ReactNode }>(node))
    return toText(node.props.children);
  return node == null ? '' : String(node);
}

/**
 * Reads the types and defaults of a table as text on the server. TypeTable is
 * a client component, and an element prop can reach it as a lazy reference,
 * which has no text.
 */
export function withTextTypes(
  type: Record<string, TypeNode>
): Record<string, TypeNode> {
  return Object.fromEntries(
    Object.entries(type).map(([name, node]) => [
      name,
      {
        ...node,
        type: toText(node.type),
        typeDescription:
          node.typeDescription === undefined
            ? undefined
            : toText(node.typeDescription),
        default: node.default === undefined ? undefined : toText(node.default)
      }
    ])
  );
}
