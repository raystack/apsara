import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { TableState } from "@tanstack/react-table";
import type { ChangeEvent, FunctionComponent } from "react";
import React from "react";
import { Flex } from "~/components/flex";
import { TextField } from "~/components/textfield";
import type { CSS } from "../../../stitches.config";
import { styled } from "../../../stitches.config";
import { useTable } from "../hooks/useTable";

type InputProps = React.ComponentProps<typeof TextField>;
interface TableGlobalSearchProps extends InputProps {
  /**
   * The placeholder for the filter input
   *
   * @default "Search by any field"
   */
  placeholder?: string;
  css?: CSS;
}

const InputField = styled(Flex, {});

export const TableGlobalSearch: FunctionComponent<TableGlobalSearchProps> = ({
  placeholder = "Search by any field",
  css,
  ...props
}) => {
  const { state, setState } = useTable();
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setState((prevState: TableState) => ({
      ...prevState,
      pagination: prevState.pagination
        ? { pageIndex: 0, pageSize: prevState.pagination.pageSize }
        : prevState.pagination,
      globalFilter: value,
    }));
  };
  return (
    <InputField
      direction="row"
      align="center"
      css={{ position: "relative", width: "100%" }}
    >
      <MagnifyingGlassIcon style={{ position: "absolute", left: "8px" }} />
      <TextField
        {...props}
        css={{ px: "28px", ...css }}
        placeholder={placeholder}
        value={state.globalFilter}
        onChange={handleSearchChange}
      />
    </InputField>
  );
};
