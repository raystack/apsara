import { LivePreview } from "react-live";
import styles from "./preview.module.css";
import { cx } from "class-variance-authority";

export default function Preview() {
  return <LivePreview className={cx(styles.preview, "not-prose")} />;
}
