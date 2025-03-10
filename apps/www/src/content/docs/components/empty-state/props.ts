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

  /** Map of classNames for internal components */
  classNames?: {
    /** Class for the container */
    container?: string;

    /** Class for the icon container */
    iconContainer?: string;

    /** Class for the icon */
    icon?: string;

    /** Class for the heading */
    heading?: string;

    /** Class for the subheading */
    subHeading?: string;
  };
}
