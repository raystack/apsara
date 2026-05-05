export interface FormProps {
  /**
   * Determines when the form should be validated.
   * Field-level `validationMode` takes precedence over this.
   * @defaultValue "onSubmit"
   */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';

  /**
   * Validation errors returned externally, typically from a server response.
   * Keys correspond to field `name` attributes; values are error message(s).
   */
  errors?: Record<string, string | string[]>;

  /**
   * Event handler called when the form is submitted.
   * `preventDefault()` is called on the native submit event when used.
   */
  onFormSubmit?: (
    formValues: Record<string, unknown>,
    eventDetails: object
  ) => void;

  /** Native form submit handler. Use this for React Hook Form integration. */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;

  /**
   * A ref to imperative actions.
   * Provides `validate()` which validates all fields, or a single field when a name is passed.
   */
  actionsRef?: React.RefObject<{
    validate: (fieldName?: string) => void;
  } | null>;

  /** Additional CSS class names. */
  className?: string;
}
