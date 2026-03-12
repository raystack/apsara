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
  <Toolbar.Button render={<Button variant="text" color="neutral" size="small" />}>
    32px
  </Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Button render={<IconButton variant="text" color="neutral" size="small" />}>
      <FontBoldIcon />
    </Toolbar.Button>
    <Toolbar.Button render={<IconButton variant="text" color="neutral" size="small" />}>
      <FontItalicIcon />
    </Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Link href="https://example.com">Help</Toolbar.Link>
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
