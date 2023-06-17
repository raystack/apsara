import type { ReactNode } from "react";
import React from "react";
import { Button } from "~/components/button";
import { useTable } from "../hooks/useTable";

export interface TableColumnSelectProps {
  children?: ReactNode;
}
export function TableColumnSelect(props: TableColumnSelectProps) {
  const { clearFilters } = useTable();
  return (
    <Button variant="primary" onClick={clearFilters}>
      Clear Filter
    </Button>
  );
}
