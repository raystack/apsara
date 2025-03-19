import Image from "next/image";
import { cx } from "class-variance-authority";
import styles from "./logo.module.css";

type Props = {
  variant?: "small" | "large";
  onlyWordmark?: boolean;
};

export default function Logo({
  variant = "small",
  onlyWordmark = false,
}: Props) {
  const size = variant === "small" ? 24 : 48;
  return (
    <div className={cx(styles.container, styles[variant])}>
      <Image src={`/assets/logo.svg`} alt="" width={size} height={size} />
      {!onlyWordmark && <p>Apsara</p>}
    </div>
  );
}
