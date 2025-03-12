"use client";
import { type ButtonHTMLAttributes } from "react";
import { SearchIcon } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/provider";
import styles from "./search-toggle.module.css";
import { cx } from "class-variance-authority";
import { InputField } from "@raystack/apsara/v1";

export function SearchToggle(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpenSearch, enabled } = useSearchContext();

  return (
    <button
      type="button"
      className={cx(styles.iconButton, props.className)}
      data-search=""
      aria-label="Open Search"
      onClick={() => {
        setOpenSearch(true);
      }}>
      <SearchIcon />
    </button>
  );
}

export function LargeSearchToggle(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();

  return (
    <InputField
      label=""
      placeholder="Search..."
      suffix="CMD K"
      onClick={() => {
        setOpenSearch(true);
      }}
    />
  );
}
