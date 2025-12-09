import { z } from 'zod/v4';

export const TagSchema = z.enum(['new', 'beta', 'update']).optional();
export const SourceSchema = z.string().optional();

export type TagType = z.infer<typeof TagSchema>;
export type SourceType = z.infer<typeof SourceSchema>;
