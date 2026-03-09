'use client';

export const preview = {
  type: 'code',
  code: `<Collapsible style={{ textAlign: 'center' }}>
  <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
  <Collapsible.Panel>
    <p>This is the collapsible content. It can contain any React elements.</p>
  </Collapsible.Panel>
</Collapsible>`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledCollapsible() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible style={{ textAlign: 'center' }} open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>
        {open ? 'Hide' : 'Show'} content
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <p>This content is controlled by React state.</p>
      </Collapsible.Panel>
    </Collapsible>
  );
}`
};

export const defaultOpenDemo = {
  type: 'code',
  code: `<Collapsible defaultOpen style={{ textAlign: 'center' }}>
  <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
  <Collapsible.Panel>
    <p>This content is visible by default.</p>
  </Collapsible.Panel>
</Collapsible>`
};

export const disabledDemo = {
  type: 'code',
  code: `<Collapsible disabled style={{ textAlign: 'center' }}>
  <Collapsible.Trigger>Cannot toggle (disabled)</Collapsible.Trigger>
  <Collapsible.Panel>
    <p>This content cannot be toggled.</p>
  </Collapsible.Panel>
</Collapsible>`
};
