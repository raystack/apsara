import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";

import * as React from "react";
import { CSS, styled, VariantProps } from "../../stitches.config";
import { Box } from "../box";
import { Dialog } from "../dialog";
import { Text } from "../text";

const StyledCommandPrimitive = styled(CommandPrimitive, {
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  borderRadius: "$2",
  backgroundColor: "#fcfcfc",
  boxShadow: "0 16px 70px rgba(0,0,0,.2)",
  border: "1px solid #e2e2e2",
  py: 8,
});

type CommandPrimitiveProps = React.ComponentProps<typeof CommandPrimitive>;
type CommandPrimitiveVariants = VariantProps<typeof CommandPrimitive>;
type CommandProps = CommandPrimitiveProps &
  CommandPrimitiveVariants & { css?: CSS };

const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, ...props }, ref) => (
  <StyledCommandPrimitive ref={ref} {...props} />
));
CommandRoot.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <Dialog.Content css={{ overflow: "hidden", padding: "0" }}>
        {/* update css for command */}
        <Command css={{}}>{children}</Command>
      </Dialog.Content>
    </Dialog>
  );
};

const StyledCommandPrimitiveInput = styled(CommandPrimitive.Input, {
  display: "flex",
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
  backgroundColor: "transparent",
  fontSize: "12px",
  lineHeight: "1.25rem",
  width: "100%",
  height: "2.75rem",
  borderRadius: "0.375rem",
  outline: "none",
  border: "none",
  color: "$fgBase",
  "&:placeholder": {
    color: "$gray6",
  },
});
type CommandPrimitiveInputProps = React.ComponentProps<
  typeof CommandPrimitive.Input
>;
type CommandPrimitiveInputVariants = VariantProps<
  typeof CommandPrimitive.Input
>;
type CommandInputProps = CommandPrimitiveInputProps &
  CommandPrimitiveInputVariants & { css?: CSS };
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <Box
    css={{
      display: "flex",
      paddingLeft: "$4",
      paddingRight: "$4",
      alignItems: "center",
      borderBottom: "1px solid $borderBase",
    }}
    cmdk-input-wrapper=""
  >
    <MagnifyingGlassIcon
      style={{
        marginRight: "0.5rem",
        width: "1rem",
        height: "1rem",
        opacity: "0.5",
      }}
    />
    <StyledCommandPrimitiveInput ref={ref} {...props} />
  </Box>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const StyledCommandPrimitiveList = styled(CommandPrimitive.List, {
  overflowY: "auto",
  overflowX: "hidden",
  maxHeight: "300px",
});
type CommandPrimitiveListProps = React.ComponentProps<
  typeof CommandPrimitive.List
>;
type CommandPrimitiveListVariants = VariantProps<typeof CommandPrimitive.List>;
type CommandListProps = CommandPrimitiveListProps &
  CommandPrimitiveListVariants & { css?: CSS };
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} {...props} />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const StyledCommandPrimitiveEmpty = styled(CommandPrimitive.Empty, {
  paddingTop: "$6",
  paddingBottom: "$6",
  fontSize: "$2",
  lineHeight: "$5",
  textAlign: "center",
});
type CommandPrimitiveEmptyProps = React.ComponentProps<
  typeof CommandPrimitive.Empty
>;
type CommandPrimitiveEmptyVariants = VariantProps<
  typeof CommandPrimitive.Empty
>;
type CommandEmptyProps = CommandPrimitiveEmptyProps &
  CommandPrimitiveEmptyVariants & { css?: CSS };
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>((props, ref) => <StyledCommandPrimitiveEmpty ref={ref} {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const StyledCommandPrimitiveGroup = styled(CommandPrimitive.Group, {
  overflow: "hidden",
  px: "$2",
  "[cmdk-group-heading]": {
    fontSize: "$1",
    padding: "$2 $2",
  },
});

type CommandPrimitiveGroupProps = React.ComponentProps<
  typeof CommandPrimitive.Group
>;
type CommandPrimitiveGroupVariants = VariantProps<
  typeof CommandPrimitive.Group
>;
type CommandGroupProps = CommandPrimitiveGroupProps &
  CommandPrimitiveGroupVariants & { css?: CSS };

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <StyledCommandPrimitiveGroup ref={ref} {...props} />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const StyledCommandSeparator = styled(CommandPrimitive.Separator, {
  marginLeft: "-$1",
  marginRight: "-$1",
  height: "1px",
});

type CommandPrimitiveSeparatorProps = React.ComponentProps<
  typeof CommandPrimitive.Separator
>;
type CommandPrimitiveSeparatorVariants = VariantProps<
  typeof CommandPrimitive.Separator
>;
type CommandSeparatorProps = CommandPrimitiveSeparatorProps &
  CommandPrimitiveSeparatorVariants & { css?: CSS };
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <StyledCommandSeparator ref={ref} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const StyledCommandItem = styled(CommandPrimitive.Item, {
  display: "flex",
  position: "relative",
  paddingTop: "$1",
  paddingBottom: "$1",
  paddingLeft: "$2",
  paddingRight: "$2",
  fontSize: "12px",
  lineHeight: "1.25rem",
  alignItems: "center",
  borderRadius: "$2",
  cursor: "default",
  outline: "0",
  userSelect: "none",
  height: 36,
  justifyContent: "space-between",
  gap: 8,
  px: 8,
  '&[aria-selected="true"]': {
    background: "#ededed",
    color: "$fgBase",
  },

  "&:active": {
    background: "$fgBase",
  },
});

type CommandPrimitiveItemProps = React.ComponentProps<
  typeof CommandPrimitive.Item
>;
type CommandPrimitiveItemVariants = VariantProps<typeof CommandPrimitive.Item>;
type CommandItemProps = CommandPrimitiveItemProps &
  CommandPrimitiveItemVariants & { css?: CSS };
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => <StyledCommandItem ref={ref} {...props} />);

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Text
      css={{
        marginLeft: "auto",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        letterSpacing: "0.1em",
      }}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Shortcut: CommandShortcut,
  Separator: CommandSeparator,
});
