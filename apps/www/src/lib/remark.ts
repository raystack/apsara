import type { Parent, Root, Table, TableRow, Text } from 'mdast';
import { visit } from 'unist-util-visit';

interface TableEntry {
  name: string;
  type: string;
  tags?: { defaultValue?: string };
  required?: boolean;
  description?: string;
}

interface TypeObj {
  name: string;
  entries: TableEntry[];
}

export function remarkTypeTableToMd() {
  return (tree: Root) => {
    visit(
      tree,
      'mdxJsxFlowElement',
      (node: any, index: number | undefined, parent: Parent | undefined) => {
        if (node.name !== 'TypeTable' || !parent || typeof index !== 'number')
          return;

        const typeProp = node.attributes.find(
          (attr: any) => attr.name === 'type'
        );
        if (
          !typeProp ||
          !typeProp.value ||
          typeof typeProp.value.value !== 'string'
        )
          return;

        let typeObj: TypeObj;
        try {
          let expr = typeProp.value.value.trim();
          if (expr.startsWith('{') && expr.endsWith('}')) {
            expr = '(' + expr + ')';
          }
          // eslint-disable-next-line no-eval
          typeObj = eval(expr);
        } catch {
          return;
        }

        const headers = ['Name', 'Type', 'Default', 'Required', 'Description'];
        const rows = (typeObj.entries || []).map((entry: TableEntry) => [
          entry.name,
          entry.type || '',
          entry.tags?.defaultValue || '',
          entry.required ? 'Yes' : 'No',
          entry.description || ''
        ]);

        // Build MDAST table node with correct types
        const tableNode: Table = {
          type: 'table',
          align: [],
          children: [
            {
              type: 'tableRow',
              children: headers.map(header => ({
                type: 'tableCell',
                children: [{ type: 'text', value: header } as Text]
              }))
            } as TableRow,
            ...rows.map(
              row =>
                ({
                  type: 'tableRow',
                  children: row.map(cell => ({
                    type: 'tableCell',
                    children: [{ type: 'text', value: cell } as Text]
                  }))
                }) as TableRow
            )
          ]
        };

        parent.children.splice(index, 1, tableNode);
      }
    );
  };
}
