export interface EmptyStateProps {
  /** Icon to show in top of empty state */
  icon?: React.ReactNode;

  /** Primary heading message */
  heading?: string;

  /** Secondary heading message */
  subHeading?: string;

  /** Action to show in empty state like button or link */
  primaryAction?: React.ReactNode;

  /** Secondary action to show in empty state like button or link */
  secondaryAction?: React.ReactNode;

  /** Visual style variant of the empty state
   * @default "empty1"
   */
  variant?: 'empty1' | 'empty2';

  /** Map of classNames for internal components */
  classNames?: {
    /**
     * Class for the container.
     * @deprecated Use `[data-slot="empty-state"]` instead.
     */
    container?: string;

    /**
     * Class for the icon container.
     * @deprecated Use `[data-slot="empty-state-icon-container"]` instead.
     */
    iconContainer?: string;

    /**
     * Class for the icon.
     * @deprecated Use `[data-slot="empty-state-icon"]` instead.
     */
    icon?: string;

    /**
     * Class for the heading.
     * @deprecated Use `[data-slot="empty-state-heading"]` instead.
     */
    heading?: string;

    /**
     * Class for the subheading.
     * @deprecated Use `[data-slot="empty-state-subheading"]` instead.
     */
    subHeading?: string;
  };
}
