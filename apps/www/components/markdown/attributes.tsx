import { Table } from "@odpf/apsara";
import props from "~/configs/props";

type AttributesProps = {
  type: string;
};

export const Attributes = ({ type }: AttributesProps) => {
  const { headers = [], rows = [] } = props[type];

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {headers.map((header) => (
            <Table.Head key={header}>{header}</Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row, index) => (
          <Table.Row key={index}>
            {row.map((column, index) => {
              return <Table.Cell key={index}>{column}</Table.Cell>;
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
