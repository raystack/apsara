'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { cva } from 'class-variance-authority';
import { Command as CommandPrimitive } from 'cmdk';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { ComponentProps } from 'react';

import { Dialog } from '../dialog';
import { Flex } from '../flex';
import styles from './command.module.css';

const command = cva(styles.command);
function CommandRoot({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={command({ className })} {...props} />;
}
CommandRoot.displayName = 'Command';

interface CommandDialogProps extends DialogPrimitive.DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <Dialog.Content style={{ overflow: 'hidden', padding: '0' }}>
        <Command className={styles.dialogcommand}>{children}</Command>
      </Dialog.Content>
    </Dialog>
  );
};

const input = cva(styles.input);
function CommandInput({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <Flex
      align='center'
      gap='small'
      cmdk-input-wrapper=''
      className={styles.inputWrapper}
    >
      <MagnifyingGlassIcon
        className={styles.inputIcon}
        width={16}
        height={16}
      />
      <CommandPrimitive.Input className={input({ className })} {...props} />
    </Flex>
  );
}

CommandInput.displayName = 'Command.Input';

const list = cva(styles.list);
function CommandList({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List className={list({ className })} {...props} />;
}

CommandList.displayName = 'Command.List';

function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className={styles.empty} {...props} />;
}

CommandEmpty.displayName = 'Command.Empty';

const group = cva(styles.group);
function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return <CommandPrimitive.Group className={group({ className })} {...props} />;
}

CommandGroup.displayName = 'Command.Group';

const separator = cva(styles.separator);
function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={separator({ className })}
      {...props}
    />
  );
}
CommandSeparator.displayName = 'Command.Separator';

const item = cva(styles.item);
function CommandItem({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) {
  return <CommandPrimitive.Item className={item({ className })} {...props} />;
}

CommandItem.displayName = 'Command.Item';

const shortcut = cva(styles.shortcut);
const CommandShortcut = ({ className, ...props }: ComponentProps<'span'>) => {
  return <span className={shortcut({ className })} {...props} />;
};
CommandShortcut.displayName = 'Command.Shortcut';

export const Command: any = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Shortcut: CommandShortcut,
  Separator: CommandSeparator
});
