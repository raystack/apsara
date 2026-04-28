'use client';

export const preview = {
  type: 'code',
  style: {
    padding: 0
  },
  tabs: [
    {
      name: 'Non-Virtualized',
      code: `<DataTableDemo />`
    },
    {
      name: 'Virtualized',
      code: `<DataTableVirtualizedDemo />`
    }
  ],
  codePreview: [
    {
      label: 'Non-Virtualized',
      code: `
      <DataTable
        data={data}
        mode="client"
        columns={columns}
        defaultSort={{ name: "email", order: "asc" }}>
        <DataTable.Toolbar />
        <DataTable.Content />
      </DataTable>`
    },
    {
      label: 'Virtualized',
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
