"use client";
import { LivePreview } from "react-live";
import styles from "./preview.module.css";

export default function Preview() {
  return <LivePreview className={styles.preview} />;
}
