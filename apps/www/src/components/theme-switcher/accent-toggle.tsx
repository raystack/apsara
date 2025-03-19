"use client";

import { type HTMLAttributes } from "react";
import { cx } from "class-variance-authority";
import styles from "./accent-toggle.module.css";
import { useTheme } from "../theme";

const accentColors = ["indigo", "mint", "orange"] as const;

export default function AccentToggle({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const { accentColor, setTheme } = useTheme();

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      data-accent-toggle=""
      {...props}>
      {accentColors.map(color => (
        <button
          key={color}
          aria-label={`Set ${color} accent`}
          className={cx(
            styles.accentButton,
            styles[color],
            accentColor === color && styles.active,
          )}
          onClick={() => {
            setTheme({ accentColor: color });
          }}
        />
      ))}
    </div>
  );
}
