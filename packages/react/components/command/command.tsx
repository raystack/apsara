import { CommandContent } from './command-content';
import {
  CommandDialog,
  CommandDialogContent,
  CommandDialogTrigger
} from './command-dialog';
import { CommandEmpty, CommandStatus } from './command-empty';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import { CommandGroup, CommandLabel, CommandSeparator } from './command-misc';
import { CommandRoot } from './command-root';

export const Command = Object.assign(CommandRoot, {
  Input: CommandInput,
  Content: CommandContent,
  Item: CommandItem,
  Empty: CommandEmpty,
  Status: CommandStatus,
  Group: CommandGroup,
  Label: CommandLabel,
  Separator: CommandSeparator,
  Dialog: CommandDialog,
  DialogTrigger: CommandDialogTrigger,
  DialogContent: CommandDialogContent
});
