import type { Node as PMNode } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';
import styles from './editor.module.css';
import type { MentionAttrs } from './mention';
import { mentionType } from './schema';

/**
 * One live chip. The node view owns the element and writes the label into it
 * synchronously — there is never an empty chip frame — while React portals the
 * consumer's `icon` and `trailing` nodes into the two slots, so those render in
 * the host tree and see Theme and any other provider context.
 */
export interface MentionPortal {
  /** Stable React key for the lifetime of this node view. */
  id: number;
  attrs: MentionAttrs;
  iconTarget: HTMLElement;
  trailingTarget: HTMLElement;
}

export interface MentionPortalRegistry {
  add: (portal: MentionPortal) => void;
  update: (id: number, attrs: MentionAttrs) => void;
  remove: (id: number) => void;
}

let nextPortalId = 0;

export class MentionNodeView implements NodeView {
  readonly dom: HTMLElement;

  private readonly id = (nextPortalId += 1);
  private readonly label: HTMLElement;
  private readonly iconTarget: HTMLElement;
  private readonly trailingTarget: HTMLElement;
  private readonly registry: MentionPortalRegistry;

  constructor(node: PMNode, registry: MentionPortalRegistry) {
    this.registry = registry;

    const root = document.createElement('span');
    root.className = styles.mention;
    root.contentEditable = 'false';
    root.draggable = false;
    root.setAttribute('data-mention', '');

    this.iconTarget = document.createElement('span');
    this.iconTarget.className = styles.mentionIcon;
    this.iconTarget.setAttribute('aria-hidden', 'true');

    this.label = document.createElement('span');
    this.label.className = styles.mentionLabel;

    this.trailingTarget = document.createElement('span');
    this.trailingTarget.className = styles.mentionTrailing;

    root.append(this.iconTarget, this.label, this.trailingTarget);
    this.dom = root;

    this.write(node.attrs as MentionAttrs);
    registry.add({
      id: this.id,
      attrs: node.attrs as MentionAttrs,
      iconTarget: this.iconTarget,
      trailingTarget: this.trailingTarget
    });
  }

  private write(attrs: MentionAttrs) {
    // The chip reads as the entity, not as the syntax that picked it: the
    // trigger stays in the serialized text and markup, where the mention
    // boundary has to survive, but the pill itself carries the label alone.
    this.label.textContent = attrs.label;
    this.dom.setAttribute('data-mention-id', attrs.id);
    this.dom.setAttribute('data-mention-type', attrs.type);
    this.dom.setAttribute('data-mention-trigger', attrs.trigger);
    this.dom.setAttribute('aria-label', `mention: ${attrs.label}`);
    this.dom.title = attrs.label;
  }

  update(node: PMNode) {
    if (node.type !== mentionType) return false;
    this.write(node.attrs as MentionAttrs);
    this.registry.update(this.id, node.attrs as MentionAttrs);
    return true;
  }

  selectNode() {
    this.dom.setAttribute('data-selected', '');
  }

  deselectNode() {
    this.dom.removeAttribute('data-selected');
  }

  /**
   * Swallowing `dragstart` is what keeps a chip from being dropped into the
   * middle of a word; a text selection that happens to contain one still
   * drags, which is the platform behavior.
   */
  stopEvent(event: Event) {
    return event.type === 'dragstart';
  }

  /** React writes into the slots; those mutations are never document edits. */
  ignoreMutation() {
    return true;
  }

  destroy() {
    this.registry.remove(this.id);
  }
}
