import DocsSidebar from '@/components/docs/sidebar';
import { docs } from '@/lib/source';
import { Flex } from '@raystack/apsara';
import type { ReactNode } from 'react';
import styles from './layout.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  console.log(docs.pageTree);
  return (
    <Flex className={styles.container}>
      <DocsSidebar pageTree={docs.pageTree} />
      {children}
    </Flex>
  );
}
