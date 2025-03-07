"use client";

import { LiveEditor } from "react-live";
import { themes } from "prism-react-renderer";
import styles from "./editor.module.css";

export default function Editor() {
  return <LiveEditor theme={themes.vsLight} className={styles.editor} />;
}
