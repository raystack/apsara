import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { cva } from 'class-variance-authority';
import { Command as CommandPrimitive } from 'cmdk';
import { Dialog as DialogPrimitive } from 'radix-ui';
import React from 'react';

import { Dialog } from '../dialog';
import { Flex } from '../flex';
import styles from './command.module.css';

const command = cva(styles.command);
const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={command({ className })} {...props} />
));
CommandRoot.displayName = CommandPrimitive.displayName;

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
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <Flex
    align='center'
    gap='small'
    cmdk-input-wrapper=''
    className={styles.inputWrapper}
  >
    <MagnifyingGlassIcon className={styles.inputIcon} width={16} height={16} />
    <CommandPrimitive.Input
      ref={ref}
      className={input({ className })}
      {...props}
    />
  </Flex>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const list = cva(styles.list);
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} className={list({ className })} {...props} />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className={styles.empty} {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const group = cva(styles.group);
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={group({ className })}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const separator = cva(styles.separator);
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={separator({ className })}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const item = cva(styles.item);
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item ref={ref} className={item({ className })} {...props} />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const shortcut = cva(styles.shortcut);
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={shortcut({ className })} {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';

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
