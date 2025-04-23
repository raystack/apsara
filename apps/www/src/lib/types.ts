import { z } from "zod";

export const TagSchema = z.enum(["new", "beta", "update", ""]).default("");

export type TagType = z.infer<typeof TagSchema>;
