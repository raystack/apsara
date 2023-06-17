import { SimpleTable } from "@raystack/apsara";
import props from "~/configs/props";

type AttributesProps = {
  type: string;
};

export const Attributes = ({ type }: AttributesProps) => {
  const { headers = [], rows = [] } = props[type];

  return (
    <SimpleTable>
      <SimpleTable.Thead>
        <SimpleTable.Tr>
          {headers.map((header) => (
            <SimpleTable.Th key={header} css={{ py: "$3" }}>
              {header}
            </SimpleTable.Th>
          ))}
        </SimpleTable.Tr>
      </SimpleTable.Thead>
      <SimpleTable.Body>
        {rows.map((row, index) => (
          <SimpleTable.Tr key={index}>
            {row.map((column, index) => {
              return (
                <SimpleTable.Td key={index} css={{ py: "$3" }}>
                  {column}
                </SimpleTable.Td>
              );
            })}
          </SimpleTable.Tr>
        ))}
      </SimpleTable.Body>
    </SimpleTable>
  );
};
