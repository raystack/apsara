import { cva } from "class-variance-authority";
import { themes } from "prism-react-renderer";
import React, { useEffect, useState } from "react";
import { Editor } from "react-live";
import styles from "./editor.module.css";
import { useTable, useTheme } from "@raystack/apsara";

interface Props {
  code: string;
  number?: boolean;
  border?: boolean;
  language?: string;
}

const editor = cva(styles.base, {
  variants: {
    number: {
      true: styles.editor,
    },
  },
});

const LiveEditor: React.FC<Props> = ({
  code,
  number,
  border,
  language = "jsx",
}) => {
  const [editorTheme, setEditorTheme] = useState(themes.vsLight);
  const { theme } = useTheme();

  useEffect(() => {
    setEditorTheme(theme === "dark" ? themes.vsDark : themes.vsLight);
  }, [theme]);

  return (
    <div
      style={{
        position: "relative",
        whiteSpace: "pre",
        fontFamily: "var(--font-roboto)",
        fontSize: "13px",
      }}
    >
      <Editor
        className={editor({ number: number })}
        theme={editorTheme}
        language={language}
        code={code.trim()}
      />
    </div>
  );
};

export default LiveEditor;
