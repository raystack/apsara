import figma from '@figma/code-connect';
import { Field } from '../components/field';
import { InputField } from '../components/input-field';

figma.connect(InputField, '<FIGMA_LINK>?node-id=1-297', {
  imports: ["import { Field, InputField } from '@raystack/apsara'"],
  props: {
    prefix: figma.enum('Variant', {
      Prefix: figma.textContent('Prefix')
    }),
    suffix: figma.enum('Variant', {
      Suffix: figma.textContent('Suffix')
    }),
    disabled: figma.enum('State', {
      Disabled: true
    }),
    placeholder: figma.enum('State', {
      Default: figma.textContent('Place holder'),
      Active: figma.textContent('Place holder'),
      Hover: figma.textContent('Place holder'),
      Disabled: figma.textContent('Place holder')
    }),
    value: figma.enum('State', {
      Filled: figma.enum('Variant', {
        Normal: figma.textContent('Filled'),
        Prefix: figma.textContent('Input text'),
        Suffix: figma.textContent('Input text')
      })
    }),
    size: figma.enum('Size', {
      Small: 'small',
      Large: 'large'
    }),
    label: figma.boolean('Label', {
      true: figma.textContent('Label'),
      false: undefined
    }),
    description: figma.boolean('Helper text', {
      true: figma.textContent('Helper Text'),
      false: undefined
    }),
    optional: figma.boolean('Optional'),
    leadingIcon: figma.instance('Leading Icon')
  },
  example: ({ label, description, optional, ...props }) => {
    if (label || description || optional) {
      return (
        <Field label={label} description={description} required={!optional}>
          <InputField {...props} />
        </Field>
      );
    }
    return <InputField {...props} />;
  }
});
