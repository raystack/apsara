"use client";

import * as ApsaraV1 from "@raystack/apsara/v1";
import * as Apsara from "@raystack/apsara";
import DemoPreview from "./demo-preview";
import { DemoProps } from "./types";
import DemoPlayground from "./demo-playground";
import { Info, X, Home, Laugh } from "lucide-react";
import DataTableDemo from "../datatable-demo";

export default function Demo(props: DemoProps) {
  const {
    data,
    scope = { ...Apsara, ...ApsaraV1, DataTableDemo, Info, X, Home, Laugh },
  } = props;

  if (data.type === "code") {
    return <DemoPreview scope={scope} {...data} />;
  }

  return <DemoPlayground scope={scope} {...data} />;
}
