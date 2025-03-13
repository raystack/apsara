"use client";
import { type HTMLAttributes } from "react";
import { cva, cx } from "class-variance-authority";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme";
import styles from "./theme-toggle.module.css";

const itemVariants = cva(styles.icon, {
  variants: {
    active: {
      true: styles.active,
      false: "",
    },
  },
});

const THEME_MAP = [["light", Sun] as const, ["dark", Moon] as const];

export default function ThemeToggle(props: HTMLAttributes<HTMLElement>) {
  const { setTheme, theme } = useTheme();

  return (
    <button
      className={styles.container}
      aria-label={`Toggle Theme`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      data-theme-toggle=""
      {...props}>
      {THEME_MAP.map(([key, Icon]) => {
        return (
          <Icon
            key={key}
            stroke="currentColor"
            className={cx(itemVariants({ active: theme === key }))}
          />
        );
      })}
    </button>
  );
}
