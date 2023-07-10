import { useApsaraTheme } from "@raystack/apsara";
import { cva } from "class-variance-authority";
import { themes } from "prism-react-renderer";
import React from "react";
import { Editor } from "react-live";
import styles from "./editor.module.css";

interface Props {
  code: string;
  number?: boolean;
  border?: boolean;
}

const editor = cva(styles.base, {
  variants: {
    number: {
      true: styles.editor,
    },
  },
});

const LiveEditor: React.FC<Props> = ({ code, number, border }) => {
  const { themeName } = useApsaraTheme();
  return (
    <div
      style={{
        position: "relative",
        whiteSpace: "pre",
        fontFamily: "var(--font-roboto)",
        color: "var(--foreground-base)",
        fontSize: "13px",
      }}
    >
      <Editor
        className={editor({ number: number })}
        theme={themes.nightOwlLight}
        language="auto"
        code={code.trim()}
      />
    </div>
  );
};

export default LiveEditor;
