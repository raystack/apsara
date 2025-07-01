"use client";

import { Badge } from "@raystack/apsara";
import { TagType } from "@/lib/types";
import styles from "./tag.module.css";
import { cx } from "class-variance-authority";

interface TagProps {
  value: TagType;
  size?: "small" | "regular";
}

export default function Tag({ value, size = "small" }: TagProps) {
  if (!value.length) return;
  return (
    <Badge
      screenReaderText={value}
      size={size === "regular" ? "regular" : "micro"}
      variant={value === "beta" ? "neutral" : "gradient"}
      className={cx(styles.tag, styles[size])}>
      {value.toUpperCase()}
    </Badge>
  );
}
