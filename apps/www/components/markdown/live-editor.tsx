import { useApsaraTheme } from "@raystack/ui";
import { themes } from "prism-react-renderer";
import React from "react";
import { Editor } from "react-live";

interface Props {
  code: string;
  number?: boolean;
  border?: boolean;
}

const LiveEditor: React.FC<Props> = ({ code, number, border }) => {
  const { themeName } = useApsaraTheme();
  return (
    <div
      style={{
        position: "relative",
        whiteSpace: "pre",
        fontFamily:
          "SF Mono, ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
        color: "var(--clr-fg-base)",
        fontSize: "14px",
      }}
    >
      <Editor
        theme={themeName === "light" ? themes.nightOwlLight : themes.nightOwl}
        language="auto"
        code={code.trim()}
      />
    </div>
  );
};

export default LiveEditor;
