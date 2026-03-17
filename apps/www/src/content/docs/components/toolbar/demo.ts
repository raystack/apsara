'use client';

export const preview = {
  type: 'code',
  code: `<Toolbar>
  <Toolbar.Button>Bold</Toolbar.Button>
  <Toolbar.Button>Italic</Toolbar.Button>
  <Toolbar.Button>Underline</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.Button>Left</Toolbar.Button>
  <Toolbar.Button>Center</Toolbar.Button>
  <Toolbar.Button>Right</Toolbar.Button>
</Toolbar>`
};

export const groupDemo = {
  type: 'code',
  code: `<Toolbar>
  <Toolbar.Group>
    <Toolbar.Button>Bold</Toolbar.Button>
    <Toolbar.Button>Italic</Toolbar.Button>
    <Toolbar.Button>Underline</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Button>Left</Toolbar.Button>
    <Toolbar.Button>Center</Toolbar.Button>
    <Toolbar.Button>Right</Toolbar.Button>
  </Toolbar.Group>
</Toolbar>`
};

export const compositionDemo = {
  type: 'code',
  code: `<Toolbar>
  <Toolbar.Group aria-label="Alignment" render={<Toggle.Group/>}>
    <Toolbar.Button render={<Toggle size={4}/>} ><TextAlignLeftIcon /></Toolbar.Button>
    <Toolbar.Button render={<Toggle size={4}/>}><TextAlignRightIcon /></Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group aria-label="Numerical format">
    <Toolbar.Button aria-label="Format as currency">Format</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Select defaultValue="Helvetica">
    <Toolbar.Button render={<Select.Trigger variant="text" size="small" />}>
      <Select.Value />
    </Toolbar.Button>
    <Select.Content sideOffset={8}>
      <Select.Item value="Helvetica">Helvetica</Select.Item>
      <Select.Item value="Arial">Arial</Select.Item>
    </Select.Content>
  </Select>
</Toolbar>`
};

export const disabledDemo = {
  type: 'code',
  code: `<Toolbar disabled>
  <Toolbar.Button>Bold</Toolbar.Button>
  <Toolbar.Button>Italic</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.Button>Left</Toolbar.Button>
</Toolbar>`
};
