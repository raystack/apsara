'use client';

import { Accordion, CodeBlock, Flex, Text } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import Link from 'fumadocs-core/link';
import { type ReactNode } from 'react';
import styles from './typetable.module.css';

export interface ParameterNode {
  name: string;
  description: ReactNode;
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;

  /**
   * type signature (short)
   */
  type: ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;

  default?: ReactNode;

  required?: boolean;
  deprecated?: boolean;

  parameters?: ParameterNode[];

  returns?: ReactNode;
}

export function TypeTable({
  type,
  className
}: {
  type: Record<string, TypeNode>;
  className?: string;
}) {
  const entries = Object.entries(type);

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.header}>
        <p className={styles.propLabel}>Prop</p>
        <p className={styles.typeLabel}>Type</p>
      </div>
      <Accordion type='multiple'>
        {entries.map(([key, value]) => (
          <Item key={key} name={key} item={value} />
        ))}
      </Accordion>
    </div>
  );
}

function Item({
  name,
  item: {
    parameters = [],
    description,
    required = false,
    deprecated,
    typeDescription,
    default: defaultValue,
    type,
    typeDescriptionLink,
    returns
  }
}: {
  name: string;
  item: TypeNode;
}) {
  return (
    <Accordion.Item value={name} className={styles.accordionItem}>
      <Accordion.Trigger className={styles.trigger}>
        <code
          className={deprecated ? styles.propNameDeprecated : styles.propName}
        >
          {name}
          {required ? <span className={styles.required}>*</span> : ''}
        </code>
        <span className={styles.fieldValue}>
          {typeDescriptionLink ? (
            <Link href={typeDescriptionLink} className={styles.typeLink}>
              {type}
            </Link>
          ) : (
            <CodeBlock hideLineNumbers>
              <CodeBlock.Code language='tsx' className={styles.fieldCode}>
                {String(type)}
              </CodeBlock.Code>
            </CodeBlock>
          )}
        </span>
      </Accordion.Trigger>
      <Accordion.Content className={styles.content}>
        <Flex direction='column' gap={5} align='start'>
          <Flex gap={5}>
            <Text size='small' className={styles.fieldLabel}>
              Name
            </Text>
            <code>{name}</code>
          </Flex>
          {description && (
            <Flex gap={5}>
              <Text size='small' className={styles.fieldLabel}>
                Description
              </Text>
              <Text size='small' className={styles.fieldValue}>
                {description}
              </Text>
            </Flex>
          )}
          <Flex gap={5}>
            <Text size='small' className={styles.fieldLabel}>
              Type
            </Text>
            <CodeBlock hideLineNumbers>
              <CodeBlock.Code
                language='tsx'
                className={cx(styles.fieldCode, styles.fieldValue)}
              >
                {String(type) +
                  (!required && !String(type).includes('undefined')
                    ? ' | undefined'
                    : '')}
              </CodeBlock.Code>
            </CodeBlock>
          </Flex>
          {defaultValue && (
            <Flex gap={5}>
              <Text size='small' className={styles.fieldLabel}>
                Default
              </Text>
              <CodeBlock hideLineNumbers>
                <CodeBlock.Code
                  language='tsx'
                  className={cx(styles.fieldCode, styles.fieldValue)}
                >
                  {String(defaultValue)}
                </CodeBlock.Code>
              </CodeBlock>
            </Flex>
          )}
          {parameters.length > 0 && (
            <Flex gap={5}>
              <Text size='small' className={styles.fieldLabel}>
                Parameters
              </Text>
              <Flex direction='column' gap={2}>
                {parameters.map(param => (
                  <div key={param.name} className={styles.parameter}>
                    <Text size='small' weight='medium'>
                      {param.name} -
                    </Text>
                    <Text size='small'>{param.description}</Text>
                  </div>
                ))}
              </Flex>
            </Flex>
          )}
          {returns && (
            <Flex gap={5}>
              <Text size='small' className={styles.fieldLabel}>
                Returns
              </Text>
              <Text size='small' className={styles.fieldValue}>
                {returns}
              </Text>
            </Flex>
          )}
        </Flex>
      </Accordion.Content>
    </Accordion.Item>
  );
}
