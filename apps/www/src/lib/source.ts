import { docs as RAW_DOCS } from "@/.source";
import { loader } from "fumadocs-core/source";

export const docs = loader({
  baseUrl: "/docs",
  source: RAW_DOCS.toFumadocsSource(),
});
