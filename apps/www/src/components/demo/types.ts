export type ScopeType = Record<string, unknown>;

export type DemoPreviewProps = {
  type: "code";
  code?: string;
  tabs?: { name: string; code: string }[];
  scope?: ScopeType;
};

export type DemoPlaygroundProps = {
  type: "playground";
  controls: ControlsType;
  getCode: GetCodeType;
  scope?: ScopeType;
};

export type DemoProps = {
  scope?: ScopeType;
  data: Omit<DemoPreviewProps, "scope"> | Omit<DemoPlaygroundProps, "scope">;
};

export type ControlType = {
  type: "select" | "text" | "checkbox" | "number";
  options?: string[];
  defaultValue?: string | boolean;
  initialValue?: string | boolean;
  min?: number;
  max?: number;
};

export type ControlsType = Record<string, ControlType>;

export type GetCodeType = (
  updatedProps: Record<string, any>,
  props: Record<string, any>,
) => string;
