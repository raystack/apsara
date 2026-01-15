import { cx } from 'class-variance-authority';
import { LivePreview } from 'react-live';
import styles from './preview.module.css';

export default function Preview({ className }: { className?: string }) {
  return <LivePreview className={cx(styles.preview, 'not-prose', className)} />;
}
