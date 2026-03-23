'use client';

export const playground = {
  type: 'code',
  code: `<Form onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}>
  <Field label="Email" required>
    <InputField type="email" placeholder="Enter email" />
  </Field>
  <Field label="Message" optional>
    <TextArea placeholder="Enter message" />
  </Field>
  <Button type="submit">Submit</Button>
</Form>`
};

export const basicDemo = {
  type: 'code',
  code: `<Form onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}>
  <Field label="Name" required>
    <InputField placeholder="Enter your name" />
  </Field>
  <Button type="submit">Submit</Button>
</Form>`
};

export const withFieldsDemo = {
  type: 'code',
  code: `<Form onSubmit={(e) => { e.preventDefault(); }}>
  <Field label="First Name" required>
    <InputField placeholder="John" />
  </Field>
  <Field label="Last Name" required>
    <InputField placeholder="Doe" />
  </Field>
  <Field label="Email" required helperText="We'll send a confirmation email">
    <InputField type="email" placeholder="john@example.com" />
  </Field>
  <Field label="Bio" optional>
    <TextArea placeholder="Tell us about yourself" />
  </Field>
  <Button type="submit">Create Account</Button>
</Form>`
};

export const serverErrorsDemo = {
  type: 'code',
  code: `function ServerErrorExample() {
  const [errors, setErrors] = React.useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    // Simulate server validation
    setErrors({ email: 'This email is already taken' });
  }

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <Field name="email" label="Email" required>
        <InputField type="email" placeholder="Enter email" />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}`
};

export const validationModesDemo = {
  type: 'code',
  tabs: [
    {
      name: 'onSubmit',
      code: `<Form validationMode="onSubmit">
  <Field name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control type="email" required placeholder="Validated on submit" />
    <Field.Error match="valueMissing">Email is required</Field.Error>
    <Field.Error match="typeMismatch">Enter a valid email</Field.Error>
  </Field>
  <Button type="submit">Submit</Button>
</Form>`
    },
    {
      name: 'onBlur',
      code: `<Form validationMode="onBlur">
  <Field name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control type="email" required placeholder="Validated on blur" />
    <Field.Error match="valueMissing">Email is required</Field.Error>
  </Field>
</Form>`
    },
    {
      name: 'onChange',
      code: `<Form validationMode="onChange">
  <Field name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control type="email" required placeholder="Validated on change" />
    <Field.Error match="typeMismatch">Enter a valid email</Field.Error>
  </Field>
</Form>`
    }
  ]
};
