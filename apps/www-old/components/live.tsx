import React from "react";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import Editor from "./editor/editor";

export interface Props {
  code: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  scope: {
    [key: string]: any;
  };
}

const DynamicLive: React.FC<Props> = ({ code, scope, visible, setVisible }) => {
  return (
    <LiveProvider code={code} scope={scope}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          minHeight: "280px",
          alignItems: "center",
          justifyContent: "center",
          background: "url(/dot.svg)",
        }}
      >
        <LivePreview />
        <LiveError className="live-error" />
      </div>
      <Editor code={code} visible={visible} setVisible={setVisible} />
    </LiveProvider>
  );
};

export default DynamicLive;
