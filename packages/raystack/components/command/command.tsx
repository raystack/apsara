import { CommandContent } from './command-content';
import {
  CommandDialog,
  CommandDialogContent,
  CommandDialogTrigger
} from './command-dialog';
import { CommandEmpty } from './command-empty';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import {
  CommandGroup,
  CommandLabel,
  CommandSeparator,
  CommandShortcut
} from './command-misc';
import { CommandRoot } from './command-root';

export const Command = Object.assign(CommandRoot, {
  Input: CommandInput,
  Content: CommandContent,
  Item: CommandItem,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Label: CommandLabel,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Dialog: CommandDialog,
  DialogTrigger: CommandDialogTrigger,
  DialogContent: CommandDialogContent
});
