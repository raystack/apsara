'use client';

export const playground = {
  type: 'code',
  code: `<Fieldset legend="Personal Information">
  <Field label="First Name" required>
    <InputField placeholder="John" />
  </Field>
  <Field label="Last Name" required>
    <InputField placeholder="Doe" />
  </Field>
  <Field label="Email" required>
    <InputField type="email" placeholder="john@example.com" />
  </Field>
</Fieldset>`
};

export const basicDemo = {
  type: 'code',
  code: `<Fieldset legend="Contact Details">
  <Field label="Phone" required>
    <InputField type="tel" placeholder="+1 (555) 000-0000" />
  </Field>
  <Field label="Address" optional>
    <InputField placeholder="123 Main St" />
  </Field>
</Fieldset>`
};

export const subComponentDemo = {
  type: 'code',
  code: `<Fieldset>
  <Fieldset.Legend>Account Settings</Fieldset.Legend>
  <Field label="Username" required>
    <InputField placeholder="Enter username" />
  </Field>
  <Field label="Password" required>
    <InputField type="password" placeholder="Enter password" />
  </Field>
</Fieldset>`
};

export const disabledDemo = {
  type: 'code',
  code: `<Fieldset legend="Disabled Section" disabled>
  <Field label="Read Only Field">
    <InputField placeholder="Cannot edit" />
  </Field>
  <Field label="Another Field">
    <InputField placeholder="Also disabled" />
  </Field>
</Fieldset>`
};

export const nestedDemo = {
  type: 'code',
  code: `<Form>
  <Fieldset legend="Personal Info">
    <Field label="Full Name" required>
      <InputField placeholder="John Doe" />
    </Field>
  </Fieldset>
  <Fieldset legend="Work Info">
    <Field label="Company" required>
      <InputField placeholder="Acme Inc." />
    </Field>
    <Field label="Role" optional>
      <InputField placeholder="Software Engineer" />
    </Field>
  </Fieldset>
  <Button type="submit">Save</Button>
</Form>`
};
