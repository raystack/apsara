# Form problems and solutions

1. Generate form based on configuration
    ```
    <FormBuilder.Items
        form={form}
        meta={CONFIGURATION_OBJECT}
    />

    const CONFIGURATION_OBJECT = {
        {
           name: 'email', // required
           label: 'E-mail',
           widget: 'input',
           placeholder: 'Enter your email',
           rules: [
             {
               type: 'email',
               message: 'The input is not valid E-mail!'
             },
             {
               required: true,
               message: 'Please input your E-mail!'
             }
           ]
        }
    }
    ```
2. Show tooltip for help message
   pass `tooltip` props in CONFIGURATION_OBJECT
   
3. Dependent values
   ```
    NOTE: Need to implement 
    `const forceUpdate = FormBuilder.useForceUpdate();`
    `form -> onValuesChange={forceUpdate}`

    dependencies: ['password'],
    depends: {
        operator: 'Eq',
        value: 'json'
    },
   ```
4. `viewMode` support for local & global form
5. `disabled` field support for local for now
6. Dynamic fields 
   we just to have to update fields based on field selected
   Note: we need to have
   `const forceUpdate = FormBuilder.useForceUpdate();`
   `form -> onValuesChange={forceUpdate}`
7. Async Data Storage