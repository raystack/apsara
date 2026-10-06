'use client';

import { activeTextStyle, setHeading, setParagraph } from './core/commands';
import { type EditorHeadingLevel, HEADING_LEVELS } from './core/schema';
import { useEditorStore, useStoreSelector } from './editor-context';
import type { EditorControlBaseProps } from './editor-control';
import { HEADING_DEFAULTS, PARAGRAPH_DEFAULT } from './editor-defaults';
import {
  EditorMenuControl,
  EditorMenuItems,
  type EditorMenuOption,
  sameFlags
} from './editor-menu-control';

export interface EditorHeadingMenuProps extends EditorControlBaseProps {
  /**
   * The heading levels in the menu.
   * @default [1, 2, 3, 4]
   */
  levels?: EditorHeadingLevel[];
}

/** A menu that sets the text block to regular text or a heading. */
export function EditorHeadingMenu({
  levels = HEADING_LEVELS as EditorHeadingLevel[],
  label = 'Text style',
  ...props
}: EditorHeadingMenuProps) {
  const store = useEditorStore('Editor.HeadingMenu');
  const current = useStoreSelector(store, state =>
    activeTextStyle(state.state)
  );
  const editable = useStoreSelector(store, state => state.isEditable());

  if (!store.schema.nodes.heading) return null;

  const Icon =
    typeof current === 'number'
      ? HEADING_DEFAULTS[current].Icon
      : PARAGRAPH_DEFAULT.Icon;

  return (
    <EditorMenuControl
      data-slot='editor-heading-menu'
      label={label}
      trigger={<Icon />}
      disabled={!editable}
      {...props}
    >
      <HeadingOptions levels={levels} />
    </EditorMenuControl>
  );
}

EditorHeadingMenu.displayName = 'Editor.HeadingMenu';

function HeadingOptions({ levels }: { levels: EditorHeadingLevel[] }) {
  const store = useEditorStore('Editor.HeadingMenu');
  const current = useStoreSelector(store, state =>
    activeTextStyle(state.state)
  );
  const can = useStoreSelector(
    store,
    state =>
      [setParagraph, ...levels.map(level => setHeading(level))].map(command =>
        command(state.state)
      ),
    sameFlags
  );

  const options: EditorMenuOption[] = [
    {
      key: 'paragraph',
      ...PARAGRAPH_DEFAULT,
      shortcut: store.shortcuts.paragraph,
      active: current === 'paragraph',
      disabled: current !== 'paragraph' && !can[0],
      run: () => store.run(setParagraph)
    },
    ...levels.map((level, index) => {
      const { action, ...rest } = HEADING_DEFAULTS[level];
      return {
        key: `heading-${level}`,
        ...rest,
        shortcut: action && store.shortcuts[action],
        active: current === level,
        disabled: current !== level && !can[index + 1],
        run: () => store.run(setHeading(level))
      };
    })
  ];

  return <EditorMenuItems options={options} />;
}
