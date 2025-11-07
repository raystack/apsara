'use client';

import { Separator } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { ReactSVGElement } from 'react';
import styles from './icon-details.module.css';

export interface IconDetailsProps {
  name: string;
  icon: (props: any) => ReactSVGElement;
}

const SIZES = [12, 16, 24, 48, 64];

export default function IconDetails({ name, icon: Icon }: IconDetailsProps) {
  return (
    <div className={cx(styles.container, 'prose')}>
      <h2 className={styles.heading}>{name}</h2>
      <div className={styles.demo}>
        {SIZES.map(size => (
          <Icon width={size} height={size} key={size} />
        ))}
      </div>
      <Separator />
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Usage</h3>
        <p>Import the icon</p>
        <DynamicCodeBlock
          lang='tsx'
          code={`import { \n  ${name} \n} from "@raystack/apsara/icons"`}
        />
        <p>Then render it </p>
        <DynamicCodeBlock lang='tsx' code={`<${name} />`} />
      </div>
    </div>
  );
}
