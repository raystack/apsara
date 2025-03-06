import { useContext } from "react";
import { TableContext } from "../context";

export const useDataTable = () => {
  const ctx = useContext(TableContext);
  if (ctx === null) {
    throw new Error("useDataTable must be used inside of a DataTable.Provider");
  }

  return ctx;
};
