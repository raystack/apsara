'use client';

import { CopyButton, Flex, Text } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import styles from './tokentable.module.css';

export type TokenType =
  | 'color'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'blur'
  | 'typography'
  | 'default';

export interface TokenItem {
  /** The CSS variable name */
  name: string;
  /** The token value (e.g., "4px", "#ffffff") - optional for semantic tokens */
  value?: string;
  /** Description of the token's use case */
  description?: string;
}

export interface TokenTableProps {
  /** Array of token items to display */
  tokens: TokenItem[];
  /** Type of tokens for visual preview */
  type?: TokenType;
  /** Additional CSS class name */
  className?: string;
}

function TokenPreview({ token, type }: { token: TokenItem; type: TokenType }) {
  switch (type) {
    case 'color':
      return (
        <div
          className={styles.colorPreview}
          style={{ backgroundColor: `var(${token.name})` }}
        />
      );
    case 'spacing':
      return (
        <div className={styles.spacingPreviewContainer}>
          <div
            className={styles.spacingPreview}
            style={{ width: `var(${token.name})` }}
          />
        </div>
      );
    case 'radius':
      return (
        <div
          className={styles.radiusPreview}
          style={{ borderRadius: token.value || `var(${token.name})` }}
        />
      );
    case 'shadow':
      return (
        <div
          className={styles.shadowPreview}
          style={{ boxShadow: `var(${token.name})` }}
        />
      );
    case 'blur':
      return (
        <div className={styles.blurPreviewContainer}>
          <div
            className={styles.blurPreview}
            style={{ backdropFilter: `var(${token.name})` }}
          />
        </div>
      );
    case 'typography':
      return null;
    default:
      return null;
  }
}

export function TokenTable({
  tokens,
  type = 'default',
  className
}: TokenTableProps) {
  const showPreview = type !== 'default' && type !== 'typography';
  const showValue = tokens.some(token => token.value);
  const isSpacing = type === 'spacing';

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.header}>
        {showPreview && (
          <span
            className={
              isSpacing ? styles.previewLabelWide : styles.previewLabel
            }
          ></span>
        )}
        <span className={showValue ? styles.tokenLabel : styles.tokenLabelWide}>
          Token
        </span>
        {showValue && <span className={styles.valueLabel}>Value</span>}
        <span className={styles.descriptionLabel}>Description</span>
      </div>
      <div className={styles.body}>
        {tokens.map(token => (
          <div key={token.name} className={styles.row}>
            {showPreview && (
              <div
                className={
                  isSpacing ? styles.previewCellWide : styles.previewCell
                }
              >
                <TokenPreview token={token} type={type} />
              </div>
            )}
            <div
              className={showValue ? styles.tokenCell : styles.tokenCellWide}
            >
              <Flex align='center' gap={2}>
                <code className={styles.tokenName}>{token.name}</code>
                <CopyButton
                  text={`var(${token.name})`}
                  variant='ghost'
                  className={styles.copyButton}
                />
              </Flex>
            </div>
            {showValue && (
              <div className={styles.valueCell}>
                <code className={styles.tokenValue}>{token.value}</code>
              </div>
            )}
            <div className={styles.descriptionCell}>
              <Text size='small' className={styles.description}>
                {token.description}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
