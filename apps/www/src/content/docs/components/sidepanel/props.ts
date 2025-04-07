export interface SidePanelProps {
  /**
   * The side to position the panel.
   * @default "left"
   */
  side?: "left" | "right";

  /**
   * Content to render inside the side panel.
   */
  children: React.ReactNode;

  /**
   * Additional CSS class names to apply.
   */
  className?: string;
}

export interface SidePanelHeaderProps {
  /**
   * The title text to display in the header.
   */
  title: string;

  /**
   * Optional description text below the title.
   */
  description?: string;

  /**
   * Optional icon element to display before the title.
   */
  icon?: React.ReactNode;

  /**
   * Array of action elements to display in the header.
   */
  actions?: React.ReactNode[];
}
