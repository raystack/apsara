import {
  AnnouncementBarExamples,
  AvatarExamples,
  ButtonExamples,
} from "@/components/playground";
import styles from "./page.module.css";

export default function Playground() {
  return (
    <div className={styles.container}>
      <AnnouncementBarExamples />
      <AvatarExamples />
      <ButtonExamples />
    </div>
  );
}
