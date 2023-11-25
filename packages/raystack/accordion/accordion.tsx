import * as AccordionPrimitive from "@radix-ui/react-accordion";

import * as React from "react";

import { ChevronDownIcon, DiscIcon } from "@radix-ui/react-icons";
import { Flex } from "./../flex";
import styles from "./accordion.module.css";

const AccordionRoot = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root ref={ref} className={styles.accordion} {...props} />
));

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <Flex gap="medium" style={{ width: "100%" }}>
    <DiscIcon width={16} height={16} style={{ margin: "14px 0" }} />
    <AccordionPrimitive.Item
      ref={ref}
      className={`${styles.item} ${className}`}
      {...props}
    />
  </Flex>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={styles.header}>
    <AccordionPrimitive.Trigger ref={ref} className={styles.trigger} {...props}>
      {children}
      <ChevronDownIcon className={styles.svg} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className = "", children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className={styles.content} {...props}>
    <div className={`${styles.className}`}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export const Accordion = Object.assign(AccordionRoot, {
  Content: AccordionContent,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
});
