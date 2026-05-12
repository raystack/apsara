import type { AmountProps as ApsaraAmountProps } from '@raystack/apsara';
import type { ComponentProps } from 'react';

export type AmountProps = Omit<ApsaraAmountProps, keyof ComponentProps<'span'>>;
