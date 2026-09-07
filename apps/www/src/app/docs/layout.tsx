import { Flex } from '@raystack/apsara';
import type { ReactNode } from 'react';
import DocsSidebar from '@/components/docs/sidebar';
import { docs } from '@/lib/source';
import styles from './layout.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.surround}>
      <Flex className={styles.container}>
        <DocsSidebar pageTree={docs.pageTree} className={styles.sidebar} />
        <main className={styles.content}>{children}</main>
      </Flex>
    </div>
  );
}
