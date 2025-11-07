import { cx } from 'class-variance-authority';
import { MousePointerClick } from 'lucide-react';
import styles from './icon-details.module.css';

export default function IconEmpty() {
  return (
    <div className={cx(styles.container, styles.empty, 'prose')}>
      <MousePointerClick size={32} />
      <p>Select an icon</p>
    </div>
  );
}
