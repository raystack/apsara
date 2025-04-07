import { z } from "zod";

export const TagSchema = z.enum(["new", "beta", ""]).default("");

export type TagType = z.infer<typeof TagSchema>;
