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
  <Field label="Email" required description="We'll send a confirmation email">
    <InputField type="email" placeholder="john@example.com" />
  </Field>
  <Field label="Bio" optional>
    <TextArea placeholder="Tell us about yourself" />
  </Field>
  <Button type="submit">Create Account</Button>
</Form>`
};

export const constraintValidationDemo = {
  type: 'code',
  code: `<Form onSubmit={(e) => { e.preventDefault(); alert('Valid!'); }}>
  <Field name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control type="email" required placeholder="Enter email" />
    <Field.Error match="valueMissing">Email is required</Field.Error>
    <Field.Error match="typeMismatch">Please enter a valid email</Field.Error>
  </Field>
  <Field name="age">
    <Field.Label>Age</Field.Label>
    <Field.Control type="number" required min={18} max={120} placeholder="Your age" />
    <Field.Error match="valueMissing">Age is required</Field.Error>
    <Field.Error match="rangeUnderflow">Must be at least 18</Field.Error>
    <Field.Error match="rangeOverflow">Must be 120 or less</Field.Error>
  </Field>
  <Field name="website">
    <Field.Label>Website</Field.Label>
    <Field.Control type="url" placeholder="https://example.com" />
    <Field.Error match="typeMismatch">Enter a valid URL</Field.Error>
  </Field>
  <Button type="submit">Submit</Button>
</Form>`
};

export const customValidationDemo = {
  type: 'code',
  code: `function CustomValidationExample() {
  return (
    <Form onSubmit={(e) => { e.preventDefault(); alert('Valid!'); }}>
      <Field
        name="username"
        validate={(value) => {
          if (!value) return 'Username is required';
          if (String(value).length < 3) return 'Must be at least 3 characters';
          if (!/^[a-z0-9_]+$/.test(String(value))) return 'Only lowercase letters, numbers, and underscores';
          return null;
        }}
      >
        <Field.Label>Username</Field.Label>
        <Field.Control required placeholder="Choose a username" />
        <Field.Error match="customError" />
        <Field.Description>Lowercase letters, numbers, and underscores only</Field.Description>
      </Field>
      <Button type="submit">Check</Button>
    </Form>
  );
}`
};

export const serverErrorsDemo = {
  type: 'code',
  code: `function ServerErrorExample() {
  const [errors, setErrors] = useState({});

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

export const propsApiErrorDemo = {
  type: 'code',
  code: `function PropsApiErrorExample() {
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = {};
    if (!fd.get('name')) errs.name = 'Name is required';
    if (!fd.get('email')) errs.email = 'Email is required';
    setErrors(errs);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field label="Name" required error={errors.name}>
        <InputField name="name" placeholder="Enter name" />
      </Field>
      <Field label="Email" required error={errors.email}>
        <InputField name="email" type="email" placeholder="Enter email" />
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

export const rhfDemo = {
  type: 'code',
  code: `function RHFExample() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', role: '', notifications: true }
  });

  return (
    <Form onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}>
      <Field label="Name" required error={errors.name?.message}>
        <InputField {...register('name', { required: 'Name is required' })} placeholder="Your name" />
      </Field>

      <Field label="Email" required error={errors.email?.message}>
        <InputField {...register('email', { required: 'Email is required' })} placeholder="Email" />
      </Field>

      <Field label="Role" required error={errors.role?.message}>
        <Controller
          name="role"
          control={control}
          rules={{ required: 'Please select a role' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <Select.Trigger><Select.Value placeholder="Select role" /></Select.Trigger>
              <Select.Content>
                <Select.Item value="dev">Developer</Select.Item>
                <Select.Item value="design">Designer</Select.Item>
              </Select.Content>
            </Select>
          )}
        />
      </Field>

      {/* Switch, Checkbox must always be inside a Field when inside a Form */}
      <Field label="Notifications">
        <Controller
          name="notifications"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </Field>

      <Button type="submit">Submit</Button>
    </Form>
  );
}`
};
