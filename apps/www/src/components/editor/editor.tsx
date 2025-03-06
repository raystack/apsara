"use client";

import { LiveEditor } from "react-live";
import { themes } from "prism-react-renderer";

export default function Editor() {
  return <LiveEditor theme={themes.vsLight} />;
}
