declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

export declare module "@tanstack/table-core" {
  export interface ColumnMeta<TData extends RowData, TValue> {
    style?: Record<string, string>;
  }
}

export type TableColumnMetadata = {
  name: ReactNode | Element;
  key: string;
  value: string;
};
