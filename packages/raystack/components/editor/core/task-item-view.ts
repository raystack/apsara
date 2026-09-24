import type { Node as PMNode } from 'prosemirror-model';
import type {
  EditorView,
  NodeView,
  ViewMutationRecord
} from 'prosemirror-view';

/** A task item with a real checkbox that toggles `checked`. */
export class TaskItemView implements NodeView {
  readonly dom: HTMLLIElement;
  readonly contentDOM: HTMLElement;

  private node: PMNode;
  private readonly checkbox: HTMLInputElement;

  constructor(
    node: PMNode,
    private readonly view: EditorView,
    private readonly getPos: () => number | undefined,
    className: { item: string; checkbox: string; content: string }
  ) {
    this.node = node;

    const dom = document.createElement('li');
    dom.className = className.item;
    dom.setAttribute('data-type', 'taskItem');

    const label = document.createElement('label');
    label.contentEditable = 'false';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = className.checkbox;
    checkbox.setAttribute('aria-label', 'Done');
    // Keeps the caret where it is. The click still toggles the box.
    checkbox.addEventListener('mousedown', event => event.preventDefault());
    checkbox.addEventListener('change', () => this.toggle());
    label.append(checkbox);

    const content = document.createElement('div');
    content.className = className.content;

    dom.append(label, content);
    this.dom = dom;
    this.contentDOM = content;
    this.checkbox = checkbox;
    this.write(node);
  }

  private write(node: PMNode) {
    const checked = node.attrs.checked === true;
    this.checkbox.checked = checked;
    this.dom.setAttribute('data-checked', checked ? 'true' : 'false');
  }

  private toggle() {
    const pos = this.getPos();
    if (!this.view.editable || pos === undefined) {
      this.write(this.node);
      return;
    }
    this.view.dispatch(
      this.view.state.tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        checked: this.checkbox.checked
      })
    );
  }

  update(node: PMNode) {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.write(node);
    return true;
  }

  stopEvent(event: Event) {
    return event.target === this.checkbox;
  }

  ignoreMutation(mutation: ViewMutationRecord) {
    if (mutation.type === 'selection') return false;
    return !this.contentDOM.contains(mutation.target);
  }
}
