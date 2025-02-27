"use client";
import { useTheme } from "@raystack/apsara/v1";
import React from "react";

type Props = {};

export default function ThemeSwitcher({}: Props) {
  const theme = useTheme();
  console.log("theme -> ", theme);
  return (
    <button
      onClick={() => {
        theme.setTheme(theme.resolvedTheme === "light" ? "dark" : "light");
      }}>
      change theme
    </button>
  );
}
