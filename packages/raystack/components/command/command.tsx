import {
  CommandDialogClose,
  CommandDialogContent,
  CommandDialogDescription,
  CommandDialogRoot,
  CommandDialogTitle,
  CommandDialogTrigger
} from './command-dialog';
import { CommandEmpty } from './command-empty';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import { CommandList } from './command-list';
import {
  CommandCollection,
  CommandFooter,
  CommandGroup,
  CommandLabel,
  CommandPanel,
  CommandSeparator,
  CommandShortcut
} from './command-misc';
import { CommandRoot } from './command-root';

const CommandDialog = Object.assign(CommandDialogRoot, {
  Trigger: CommandDialogTrigger,
  Content: CommandDialogContent,
  Close: CommandDialogClose,
  Title: CommandDialogTitle,
  Description: CommandDialogDescription
});

export const Command = Object.assign(CommandRoot, {
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Label: CommandLabel,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Footer: CommandFooter,
  Panel: CommandPanel,
  Collection: CommandCollection,
  Dialog: CommandDialog
});
