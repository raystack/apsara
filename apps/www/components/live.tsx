import { styled } from "@raystack/apsara";
import React from "react";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import Editor from "./editor";

export interface Props {
  code: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  scope: {
    [key: string]: any;
  };
}

const Wrapper = styled("div", {
  gap: "$2",
  width: "100%",
  minHeight: "280px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  background: "url(/dot.svg)",
});

const DynamicLive: React.FC<Props> = ({ code, scope, visible, setVisible }) => {
  return (
    <LiveProvider code={code} scope={scope}>
      <Wrapper>
        <LivePreview />
        <LiveError className="live-error" />
      </Wrapper>
      <Editor code={code} visible={visible} setVisible={setVisible} />
    </LiveProvider>
  );
};

export default DynamicLive;
