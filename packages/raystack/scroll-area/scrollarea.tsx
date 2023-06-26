import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import styles from "./scrollarea.module.css";

const area = cva(styles.area);
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> &
    React.PropsWithChildren<VariantProps<typeof area>>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={area({ className })}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport style={{ height: "100%", width: "100%" }}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const scrollbar = cva(styles.scrollbar);
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > &
    React.PropsWithChildren<VariantProps<typeof scrollbar>>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={scrollbar({ className })}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className={styles.scrollbarthumb} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
