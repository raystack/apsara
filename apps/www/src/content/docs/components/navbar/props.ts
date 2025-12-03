export interface NavbarRootProps {
  /**
   * Makes the navbar stick to the top of the viewport when scrolling.
   * @default false
   */
  sticky?: boolean;

  /**
   * Accessible label for the navigation.
   * Use this to provide a description of the navbar's purpose.
   */
  'aria-label'?: string;

  /**
   * ID of an element that labels the navigation. Use this when you have a visible heading
   * that describes the navbar.
   */
  'aria-labelledby'?: string;
}

export interface NavbarStartProps {
  /**
   * Accessible label for the start section. Use this to describe the purpose
   * of the content in the start section (e.g., "Brand and navigation links").
   * When provided, the section will have `role="group"`.
   */
  'aria-label'?: string;
}

export interface NavbarEndProps {
  /**
   * Accessible label for the end section. Use this to describe the purpose
   * of the content in the end section (e.g., "User actions and settings").
   * When provided, the section will have `role="group"`.
   */
  'aria-label'?: string;
}
