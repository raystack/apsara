import { ChevronRightIcon } from "@radix-ui/react-icons";
import React from "react";
import LiveEditor from "../markdown/live-editor";
import useCopyToClipboard from "../useClipboard";
import { CopyButton } from "./copy";
import styles from "./editor.module.css";

interface Props {
  code: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const Editor: React.FC<Props> = ({ code, visible, setVisible }) => {
  const [_, copy] = useCopyToClipboard();
  const [copying, setCopying] = React.useState<number>(0);

  const clickHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setVisible(!visible);
  };

  const copyHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    copy(code);
    setCopying((c) => c + 1);
    setTimeout(() => {
      setCopying((c) => c - 1);
    }, 2000);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.details}>
        <div className={styles.summary} onClick={clickHandler}>
          <div className={styles.actionContainer}>
            <div className={styles.action}>
              <ChevronRightIcon width={16} />
              <span>{"Code Editor"}</span>
            </div>
            <div className={styles.action}>
              {visible && (
                <CopyButton onClick={copyHandler} copying={copying} />
              )}
            </div>
          </div>
        </div>
        <LiveEditor number code={code} />
      </div>
    </div>
  );
};

export default Editor;
