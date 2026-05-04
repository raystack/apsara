'use client';

export const playground = {
  type: 'code',
  code: `<Fieldset legend="Personal Information">
  <Field label="First Name" required>
    <Input placeholder="John" />
  </Field>
  <Field label="Last Name" required>
    <Input placeholder="Doe" />
  </Field>
  <Field label="Email" required>
    <Input type="email" placeholder="john@example.com" />
  </Field>
</Fieldset>`
};

export const basicDemo = {
  type: 'code',
  code: `<Fieldset legend="Contact Details">
  <Field label="Phone" required>
    <Input type="tel" placeholder="+1 (555) 000-0000" />
  </Field>
  <Field label="Address" required={false}>
    <Input placeholder="123 Main St" />
  </Field>
</Fieldset>`
};

export const subComponentDemo = {
  type: 'code',
  code: `<Fieldset>
  <Fieldset.Legend>Account Settings</Fieldset.Legend>
  <Field label="Username" required>
    <Input placeholder="Enter username" />
  </Field>
  <Field label="Password" required>
    <Input type="password" placeholder="Enter password" />
  </Field>
</Fieldset>`
};

export const disabledDemo = {
  type: 'code',
  code: `<Fieldset legend="Disabled Section" disabled>
  <Field label="Read Only Field">
    <Input placeholder="Cannot edit" />
  </Field>
  <Field label="Another Field">
    <Input placeholder="Also disabled" />
  </Field>
</Fieldset>`
};

export const nestedDemo = {
  type: 'code',
  code: `<Form>
  <Fieldset legend="Personal Info">
    <Field label="Full Name" required>
      <Input placeholder="John Doe" />
    </Field>
  </Fieldset>
  <Fieldset legend="Work Info">
    <Field label="Company" required>
      <Input placeholder="Acme Inc." />
    </Field>
    <Field label="Role" required={false}>
      <Input placeholder="Software Engineer" />
    </Field>
  </Fieldset>
  <Button type="submit">Save</Button>
</Form>`
};
