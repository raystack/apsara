import {
  AnnouncementBarExamples,
  AvatarExamples,
  BadgeExamples,
  BreadcrumbExamples,
  ButtonExamples,
  CalendarExamples,
  CalloutExamples,
  CheckboxExamples,
  ChipExamples,
} from "@/components/playground";
import styles from "./page.module.css";

export default function Playground() {
  return (
    <div className={styles.container}>
      <AnnouncementBarExamples />
      <AvatarExamples />
      <BadgeExamples />
      <BreadcrumbExamples />
      <ButtonExamples />
      <CalendarExamples />
      <CalloutExamples />
      <CheckboxExamples />
      <ChipExamples />
    </div>
  );
}
