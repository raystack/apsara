import figma from '@figma/code-connect';
import { Field } from '../components/field';
import { TextArea } from '../components/text-area';

figma.connect(TextArea, '<FIGMA_LINK>?node-id=180-585', {
  imports: ["import { Field, TextArea } from '@raystack/apsara'"],
  props: {
    placeholder: figma.enum('State', {
      Default: figma.textContent('Place holder'),
      Active: figma.textContent('Place holder'),
      Hover: figma.textContent('Place holder')
    }),
    value: figma.enum('State', {
      Filled: figma.textContent('Filled'),
      'Filled Active': figma.textContent('Filled')
    }),
    label: figma.boolean('Label', {
      true: figma.textContent('Label'),
      false: undefined
    }),
    description: figma.boolean('Helper text', {
      true: figma.textContent('Helper Text'),
      false: undefined
    }),
    isOptional: figma.boolean('Optional')
  },
  example: ({ label, description, isOptional, ...props }) => {
    if (label || description || isOptional) {
      return (
        <Field label={label} description={description} required={!isOptional}>
          <TextArea {...props} />
        </Field>
      );
    }
    return <TextArea {...props} />;
  }
});
