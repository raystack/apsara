import { Cross1Icon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/table-core";
import { Box } from "~/box";
import { Button } from "~/button";
import { Checkbox } from "~/checkbox";
import { Command } from "~/command";
import { Flex } from "~/flex";
import { Popover } from "~/popover";
import { Select } from "~/select";
import { Text } from "~/text";
import { TextField } from "~/textfield";
import { TableColumnMetadata } from "~/typing";
import styles from "./datatable.module.css";
import { ApsaraColumnDef } from "./datatables.types";
import { useTable } from "./hooks/useTable";

type FilteredChipProps = {
  column: Column<any, unknown>;
};

export const FilteredChip = ({ column }: FilteredChipProps) => {
  const { table, removeFilterColumn } = useTable();
  const { filterVariant } = column?.columnDef as ApsaraColumnDef;
  const options: TableColumnMetadata[] =
    (column?.columnDef?.meta as any)?.data || [];

  const facets = column?.getFacetedUniqueValues();

  const renderInputs = () => {
    switch (filterVariant) {
      case "text": {
        return (
          <TextField onChange={(e) => column.setFilterValue(e.target.value)} />
        );
      }
      case "select": {
        const selectedValues = new Set(column?.getFilterValue() as string[]);
        return (
          <Select>
            <Select.Trigger>
              <Select.Value placeholder="Select a value" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {options.map((option) => (
                  <Select.Item value={option.value} key={option.value}>
                    {option?.label || option?.value}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
        );
      }
      default: {
        const selectedValues = new Set(column?.getFilterValue() as string[]);
        return (
          <Popover>
            <Popover.Trigger asChild>
              <Button>{selectedValues.size} selected</Button>
            </Popover.Trigger>
            <Popover.Content align="start" style={{ padding: 0 }}>
              <Command>
                <Command.Input />
                <Command.List>
                  <Command.Empty>No results found.</Command.Empty>
                  <Command.Group>
                    {options.map((option: any) => {
                      const isSelected = selectedValues.has(option.value);
                      return (
                        <Command.Item
                          key={option.value}
                          onSelect={() => {
                            if (isSelected) {
                              selectedValues.delete(option.value);
                            } else {
                              selectedValues.add(option.value);
                            }
                            const filterValues = Array.from(selectedValues);
                            console.log(selectedValues, filterValues);
                            column?.setFilterValue(
                              filterValues.length ? filterValues : undefined
                            );
                          }}
                        >
                          <Flex justify="between" gap="small">
                            <Flex align="center" gap="small">
                              <Checkbox checked={isSelected} />
                              {option.icon && (
                                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{option.label}</span>
                            </Flex>

                            {facets?.get(option.value) && (
                              <span>{facets.get(option.value)}</span>
                            )}
                          </Flex>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                  {selectedValues.size > 0 && (
                    <>
                      <Command.Separator />
                      <Command.Group>
                        <Command.Item
                          onSelect={() => column?.setFilterValue(undefined)}
                          className="justify-center text-center"
                        >
                          Clear filters
                        </Command.Item>
                      </Command.Group>
                    </>
                  )}
                </Command.List>
              </Command>
            </Popover.Content>
          </Popover>
        );
      }
    }
  };

  return (
    <Box className={styles.chip}>
      <Text>{column.id}</Text>
      <Text>is</Text>

      {/* render diffrent input base on filterVariant type */}
      {renderInputs()}

      {/* close filter chip */}
      <Flex>
        <Cross1Icon
          height="12"
          width="12"
          onClick={() => {
            column.setFilterValue(undefined);
            removeFilterColumn(column.id);
          }}
        />
      </Flex>
    </Box>
  );
};
