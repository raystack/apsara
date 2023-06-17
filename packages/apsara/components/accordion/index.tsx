import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";
import { CSS, styled } from "../../stitches.config";

const StyledAccordion = styled(AccordionPrimitive.Root, {});
type AccordionPrimitiveProps = React.ComponentProps<
  typeof AccordionPrimitive.Root
>;
type AccordionProps = AccordionPrimitiveProps & { css?: CSS };

const AccordionRoot = React.forwardRef<
  React.ElementRef<typeof StyledAccordion>,
  AccordionProps
>(({ children, ...props }, forwardedRef) => (
  <StyledAccordion
    ref={forwardedRef}
    {...props}
    {...(props.type === "single" ? { collapsible: true } : {})}
  >
    {children}
  </StyledAccordion>
));

const StyledItem = styled(AccordionPrimitive.Item, {
  borderTop: "1px solid $borderBase",
  "&:last-of-type": {
    borderBottom: "1px solid $borderBase",
  },
});

const StyledHeader = styled(AccordionPrimitive.Header, {
  all: "unset",
});

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
  all: "unset",
  boxSizing: "border-box",
  userSelect: "none",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$2",
  color: "$fgBase",
  width: "100%",

  "@hover": {
    "&:hover": {
      backgroundColor: "$bgBase",
    },
  },

  "&:focus": {
    outline: "none",
  },

  svg: {
    transition: "transform 175ms cubic-bezier(0.65, 0, 0.35, 1)",
  },

  '&[data-state="open"]': {
    svg: {
      transform: "rotate(180deg)",
    },
  },

  "& > p": {
    marginBottom: "unset",
  },
});

type AccordionTriggerPrimitiveProps = React.ComponentProps<
  typeof AccordionPrimitive.Trigger
>;
type AccordionTriggerProps = AccordionTriggerPrimitiveProps & { css?: CSS };

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof StyledTrigger>,
  AccordionTriggerProps
>(({ children, ...props }, forwardedRef) => (
  <StyledHeader>
    <StyledTrigger {...props} ref={forwardedRef}>
      {children}
      <ChevronDownIcon />
    </StyledTrigger>
  </StyledHeader>
));

const StyledContent = styled(AccordionPrimitive.Content, {
  padding: "$2",
});

export const Accordion = Object.assign(AccordionRoot, {
  Item: StyledItem,
  Content: StyledContent,
  Trigger: AccordionTrigger,
});
