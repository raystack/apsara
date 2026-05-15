import { CSSProperties } from 'react';

export type ScopeType = Record<string, unknown>;

type TabProps = {
  label: string;
  code: string;
};
export type DemoPreviewProps = {
  type: 'code';
  code?: string;
  tabs?: { name: string; code: string }[];
  scope?: ScopeType;
  codePreview?: string | TabProps[];
  style?: CSSProperties;
};

export type DemoPlaygroundProps = {
  type: 'playground';
  controls: ControlsType;
  getCode: GetCodeType;
  scope?: ScopeType;
  style?: CSSProperties;
};

export type DemoProps = {
  scope?: ScopeType;
  data: Omit<DemoPreviewProps, 'scope'> | Omit<DemoPlaygroundProps, 'scope'>;
};

export type ControlType = {
  type: 'select' | 'text' | 'checkbox' | 'number' | 'icon';
  options?: string[];
  defaultValue?: string | boolean;
  initialValue?: string | boolean;
  min?: number;
  max?: number;
  isIconOptional?: boolean;
};

export type ControlsType = Record<string, ControlType>;

export type PropChangeHandlerType = (
  prop: string,
  value: string | boolean | number
) => void;

export type ComponentPropsType = Record<string, unknown>;

export type GetCodeType = (
  updatedProps: ComponentPropsType,
  props: ComponentPropsType
) => string;
