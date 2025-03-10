import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import styles from "./editor.module.css";

type props = {
  code?: string;
};

export default function Editor({ code = "" }: props) {
  return (
    <div className={styles.editor} suppressHydrationWarning>
      <DynamicCodeBlock lang="tsx" code={code} />
    </div>
  );
}
