"use client";
import { Button } from "@raystack/apsara/v1";
import React, { ChangeEvent, useEffect, useState } from "react";
import { LiveEditor, LivePreview, LiveProvider } from "react-live";
import styles from "./playground.module.css";
import { themes } from "prism-react-renderer";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

interface PropRenderOption {
  prop: string;
  type: "select" | "text" | "checkbox";
  options?: string[];
  defaultValue?: string | boolean;
}

const propRenderOptions: PropRenderOption[] = [
  {
    prop: "variant",
    type: "select",
    options: ["solid", "outline", "ghost"],
    defaultValue: "solid",
  },
  {
    prop: "color",
    type: "select",
    options: ["accent", "danger", "neutral", "success"],
    defaultValue: "accent",
  },
  {
    prop: "size",
    type: "select",
    options: ["small", "normal"],
    defaultValue: "normal",
  },
  { prop: "children", type: "text" },
  { prop: "disabled", type: "checkbox", defaultValue: false },
  { prop: "loading", type: "checkbox", defaultValue: false },
  { prop: "loaderText", type: "text", defaultValue: "" },
];

export default function Playground() {
  const [componentProps, setComponentProps] = useState({
    variant: "solid",
    children: "test",
    size: "normal",
    color: "accent",
    loaderText: "",
  });

  const { children, ...props } = componentProps;
  const propsString = Object.entries(props)
    .filter(([key, value]) => {
      const defaultValue = propRenderOptions.find(
        option => option.prop === key,
      )?.defaultValue;
      return defaultValue === undefined || value !== defaultValue;
    })
    .map(([key, value]) =>
      typeof value === "boolean" ? `${key}` : `${key}="${value}"`,
    )
    .join(" ");

  const code = `<Button ${propsString}>${children}</Button>`;

  const handlePropChange = (prop: string, value: string | boolean) => {
    setComponentProps(prevProps => ({ ...prevProps, [prop]: value }));
  };

  return (
    <LiveProvider
      code={code}
      scope={{ Button }}
      disabled
      theme={themes.vsLight}>
      <div className={styles.container}>
        <div className={styles.editor}>
          <LivePreview className={styles.preview} />
          <form className={styles.form}>
            {propRenderOptions.map(({ prop, type, options }) => (
              <label className={styles.label} key={prop}>
                {prop}
                {type === "text" && (
                  <input
                    className={styles.input}
                    type="text"
                    value={componentProps[prop] || ""}
                    onChange={e => handlePropChange(prop, e.target.value)}
                  />
                )}
                {type === "select" && (
                  <select
                    className={styles.select}
                    value={componentProps[prop] || ""}
                    onChange={e => handlePropChange(prop, e.target.value)}>
                    {options?.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {type === "checkbox" && (
                  <input
                    type="checkbox"
                    checked={!!componentProps[prop]}
                    onChange={e => handlePropChange(prop, e.target.checked)}
                  />
                )}
              </label>
            ))}
          </form>
        </div>
        <LiveEditor />
      </div>
    </LiveProvider>
  );
}
