'use client';

export const tablePreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewTableDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      <DataView data={data} fields={fields} defaultSort={{ name: "name", order: "asc" }}>
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls />
        </DataView.Toolbar>
        <DataView.List variant="table" columns={tableColumns} />
      </DataView>`
    }
  ]
};

export const listPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewListDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      <DataView data={data} fields={fields} defaultSort={{ name: "name", order: "asc" }}>
        <DataView.Toolbar>
          <DataView.Filters />
        </DataView.Toolbar>
        <DataView.List variant="list" columns={listColumns} />
      </DataView>`
    }
  ]
};

export const multiViewPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewMultiViewDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* The view switcher lives inside the DisplayControls popover. Give each
         view an optional leadingIcon to show alongside its label. */
      const views = [
        { value: "table", label: "Table", leadingIcon: <RowsIcon /> },
        { value: "list",  label: "List",  leadingIcon: <ListBulletIcon /> },
      ];

      <DataView
        data={data}
        fields={fields}
        defaultSort={{ name: "name", order: "asc" }}
        views={views}
        defaultView="table"
      >
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls />
        </DataView.Toolbar>
        <DataView.List name="table" variant="table" columns={tableColumns} />
        <DataView.List name="list"  variant="list"  columns={listColumns}  />
      </DataView>`
    }
  ]
};

export const emptyZeroPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewEmptyZeroDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      <DataView data={data} fields={fields} defaultSort={{ name: "name", order: "asc" }}>
        <DataView.Toolbar>
          <DataView.Filters />
        </DataView.Toolbar>
        <DataView.List variant="table" columns={tableColumns} />

        {/* Sibling state components driven by context. */}
        <DataView.EmptyState>
          <Text>No people match your filters.</Text>
        </DataView.EmptyState>
        <DataView.ZeroState>
          <Text>Nothing here yet.</Text>
        </DataView.ZeroState>
        <DataView.ClearFilters />
      </DataView>`
    }
  ]
};

export const virtualizedPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewVirtualizedDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* Parent container must have a fixed height. */
      <div style={{ height: 400 }}>
        <DataView data={data} fields={fields} defaultSort={{ name: "name", order: "asc" }}>
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List
            variant="table"
            columns={tableColumns}
            virtualized
            estimatedRowHeight={44}
          />
        </DataView>
      </div>`
    }
  ]
};

export const groupingPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewGroupingDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* Initial \`group_by\` is supplied via \`query\`. The user can pick a
         different group from DisplayControls — same wire format either way.
         The active group header sticks under the column header as the user
         scrolls past it. */
      <DataView
        data={data}
        fields={fields}
        defaultSort={{ name: "name", order: "asc" }}
        query={{ group_by: ["team"] }}
      >
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls />
        </DataView.Toolbar>
        <DataView.List
          variant="table"
          columns={tableColumns}
          stickyGroupHeader
        />
      </DataView>`
    }
  ]
};

export const virtualizedGroupingPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewVirtualizedGroupingDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* Virtualized + grouped + sticky. A single sticky-anchor element shows
         the active group's label; its content swaps as the user scrolls past
         each group's offset. The natural group header at the active offset is
         hidden so the anchor doesn't double-render the label. */
      <div style={{ height: 360 }}>
        <DataView
          data={data} // ~1500 rows
          fields={fields}
          defaultSort={{ name: "name", order: "asc" }}
          query={{ group_by: ["team"] }}
        >
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List
            variant="table"
            columns={tableColumns}
            virtualized
            estimatedRowHeight={44}
            stickyGroupHeader
          />
        </DataView>
      </div>`
    }
  ]
};

export const loadingPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewLoadingDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* \`DataView.List\` renders \`loadingRowCount\` skeleton rows while
         \`isLoading\` is true. Existing rows render alongside skeletons in
         server mode (load-more). */
      <DataView
        data={loadingRows}
        fields={fields}
        defaultSort={{ name: "name", order: "asc" }}
        isLoading={isLoading}
        loadingRowCount={4}
      >
        <DataView.Toolbar>
          <DataView.Filters />
        </DataView.Toolbar>
        <DataView.List variant="table" columns={tableColumns} />
      </DataView>`
    }
  ]
};

export const perViewFieldsPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewPerViewFieldsDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* The List view hides Email by overriding fields on its renderer.
         Display Properties and filter chips both reflect the override. */
      const listFields = fields.map((f) =>
        f.accessorKey === "email"
          ? { ...f, hideable: false, defaultHidden: true }
          : f
      );

      <DataView
        data={data}
        fields={fields}
        defaultSort={{ name: "name", order: "asc" }}
        views={[
          { value: "table", label: "Table" },
          { value: "list",  label: "List"  },
        ]}
        defaultView="table"
      >
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls />
        </DataView.Toolbar>
        <DataView.List name="table" variant="table" columns={tableColumns} />
        <DataView.List
          name="list"
          variant="list"
          columns={listColumns}
          fields={listFields}
        />
      </DataView>`
    }
  ]
};

export const customPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewCustomDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      <DataView data={data} fields={fields} defaultSort={{ name: "name", order: "asc" }}>
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls />
        </DataView.Toolbar>

        {/* Render prop receives the full DataView context. */}
        <DataView.Custom>
          {({ data }) =>
            data.map((p) => (
              <Card key={p.id}>
                {/* DisplayAccess gates fields on the global Display Properties toggle. */}
                <DataView.DisplayAccess accessorKey="name">
                  <Text>{p.name}</Text>
                </DataView.DisplayAccess>
                <DataView.DisplayAccess accessorKey="email">
                  <Text>{p.email}</Text>
                </DataView.DisplayAccess>
              </Card>
            ))
          }
        </DataView.Custom>
      </DataView>`
    }
  ]
};

export const searchPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewSearchDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* DataView.Search writes the input to query.search, which feeds
         TanStack's globalFilter — rows are filtered across every field as
         the user types. Try "ada", "design", or "invited". */
      <DataView data={data} fields={fields} defaultSort={{ name: "name", order: "asc" }}>
        <DataView.Toolbar>
          <DataView.Search placeholder="Search by name, email, team…" />
        </DataView.Toolbar>
        <DataView.List variant="table" columns={tableColumns} />
        <DataView.EmptyState>
          <Text>No people match your search.</Text>
        </DataView.EmptyState>
        <DataView.ClearFilters />
      </DataView>`
    }
  ]
};

export const timelinePreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewTimelineDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* The Timeline owns positioning: date → x, span → width, lane packing,
         the sticky two-tier axis, and native x/y scrolling. The card interior
         is entirely yours via renderCard. */
      const timelineActions = useRef<TimelineActions | null>(null);

      <DataView data={tasks} fields={fields} defaultSort={{ name: "start", order: "asc" }} getRowId={(t) => t.id}>
        <DataView.Toolbar>
          <DataView.Filters />
          <Flex gap={3} align="center">
            <Button size="small" variant="outline" color="neutral"
              onClick={() => timelineActions.current?.scrollTo("today")}>
              Today
            </Button>
            {/* Sort can't move a time-positioned card — hide Ordering.
                Grouping is left in: it renders swim-lane sections. */}
            <DataView.DisplayControls hideOrdering />
          </Flex>
        </DataView.Toolbar>

        <DataView.Timeline
          startField="start"
          endField="end"
          actionsRef={timelineActions}
          markers={[{ date: releaseDate, label: "Release", variant: "accent" }]}
          renderCard={(row, context) =>
            context.collapsed
              ? <CompactStub task={row.original} />
              : <TaskCard task={row.original} />
          }
        />
        <DataView.EmptyState>
          <Text>No tasks match your filters.</Text>
        </DataView.EmptyState>
      </DataView>`
    }
  ]
};

export const timelineGroupingPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewTimelineGroupingDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* group_by in the query is the whole wiring. The timeline consumes the
         same group rows DataView.List renders as section headers, so section
         order, labels, and counts match between the two views. Each band pins
         under the axis while its section is in view; packing runs per section.
         Mark the field groupable (and showGroupCount for the badge):

           { accessorKey: "team", label: "Team", groupable: true, showGroupCount: true } */

      <DataView
        data={tasks}
        fields={fields}
        defaultSort={{ name: "start", order: "asc" }}
        query={{ group_by: ["team"] }}
        getRowId={(t) => t.id}>
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls hideOrdering />
        </DataView.Toolbar>

        <DataView.Timeline
          startField="start"
          endField="end"
          // showGroupHeaders={false} hides the bands, keeps the sections
          renderCard={(row, context) => <TaskCard task={row.original} context={context} />}
        />
      </DataView>`
    }
  ]
};

export const timelinePointPreview = {
  type: 'code',
  style: { padding: 0 },
  previewCode: false,
  code: `<DataViewTimelinePointDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* Omit endField → point markers. The wrapper sizes to its content
         instead of a time span, and context.end is null. */
      <DataView data={releases} fields={fields} defaultSort={{ name: "date", order: "asc" }} getRowId={(r) => r.id}>
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls hideOrdering hideGrouping />
        </DataView.Toolbar>
        <DataView.Timeline
          startField="date"
          estimatedRowHeight={28}
          renderCard={(row) => (
            <Badge variant={row.original.channel === "stable" ? "accent" : "neutral"}>
              {row.original.version}
            </Badge>
          )}
        />
      </DataView>`
    }
  ]
};
