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

  /** Layout of the empty state
   * @default "compact"
   */
  variant?: 'compact' | 'page';
}
