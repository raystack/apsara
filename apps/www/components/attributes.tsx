import { Code, SimpleTable, Text } from "@odpf/apsara";
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
                        <SimpleTable.Th key={header}>{header}</SimpleTable.Th>
                    ))}
                </SimpleTable.Tr>
            </SimpleTable.Thead>
            <SimpleTable.Body>
                {rows.map((row, index) => (
                    <SimpleTable.Tr key={index}>
                        {row.map((column, index) => (
                            <SimpleTable.Th key={index}>
                                {column.type === "code" ? (
                                    <Code css={{ whiteSpace: "break-spaces"}}>{column.value}</Code>
                                ) : (
                                    <Text>{column.value}</Text>
                                )}
                            </SimpleTable.Th>
                        ))}
                    </SimpleTable.Tr>
                ))}
            </SimpleTable.Body>
        </SimpleTable>
    );
};
