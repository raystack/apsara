import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import styles from "./editor.module.css";
import { useMemo } from "react";
import { getFormattedCode } from "@/lib/prettier";

type props = {
  code?: string;
};

export default function Editor({ code = "" }: props) {
  const formattedCode = useMemo(() => getFormattedCode(code), [code]);

  return (
    <div className={styles.editor} suppressHydrationWarning>
      <DynamicCodeBlock lang="tsx" code={formattedCode} />
    </div>
  );
}
