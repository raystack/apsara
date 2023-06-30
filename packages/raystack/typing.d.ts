declare module "@tanstack/table-core" {}

export type TableColumnMetadata = {
  name: ReactNode | Element;
  key: string;
  value: string;
};
