'use client';

export const preview = {
  type: 'code',
  style: {
    padding: 0
  },
  previewCode: false,
  code: `<DataTableDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      <DataTable
        data={data}
        mode="client"
        columns={columns}
        defaultSort={{ name: "email", order: "asc" }}>
        <DataTable.Toolbar />
        <DataTable.Content />
      </DataTable>`
    }
  ]
};

export const virtualizedPreview = {
  type: 'code',
  style: {
    padding: 0
  },
  previewCode: false,
  code: `<DataTableVirtualizedDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* Parent container must have a fixed height */
      <div style={{ height: 400 }}>
        <DataTable
          data={data}
          mode="client"
          columns={columns}
          defaultSort={{ name: "email", order: "asc" }}>
          <DataTable.Toolbar />
          <DataTable.VirtualizedContent rowHeight={44.5} />
        </DataTable>
      </div>`
    }
  ]
};
