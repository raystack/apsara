export interface GridProps {
  /**
   * Defines named grid areas using CSS Grid template areas syntax.
   */
  templateAreas?: string | string[];

  /**
   * Controls how auto-placed items flow into the grid.
   * - "row": Items flow by row
   * - "column": Items flow by column
   * - "dense": Attempts to fill in holes in the grid
   */
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

  /**
   * Sets the size of auto-generated columns.
   * Accepts any valid CSS size value.
   */
  autoColumns?: string;

  /**
   * Sets the size of auto-generated rows.
   * Accepts any valid CSS size value.
   */
  autoRows?: string;

  /**
   * Defines the columns of the grid. Supports CSS Grid template columns syntax.
   *
   * If you pass a number, columns will be created using repeat(n, 1fr).
   */
  columns?: string | number;

  /**
   * Defines the rows of the grid. Supports CSS Grid template rows syntax.
   *
   * If you pass a number, rows will be created using repeat(n, 1fr).
   */
  rows?: string | number;

  /**
   * Sets the gap between grid items.
   */
  gap?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

  /**
   * Sets the gap between grid columns.
   */
  columnGap?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

  /**
   * Sets the gap between grid rows.
   */
  rowGap?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

  /**
   * Aligns grid items along the inline (row) axis.
   */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';

  /**
   * Aligns grid items along the block (column) axis.
   */
  alignItems?: 'start' | 'end' | 'center' | 'stretch';

  /**
   * Aligns the entire grid along the inline (row) axis.
   */
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';

  /**
   * Aligns the entire grid along the block (column) axis.
   */
  alignContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';

  /**
   * Renders the grid as an inline element instead of a block element.
   *
   * @default false
   */
  inline?: boolean;

  /**
   * Allows rendering the grid as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLDivElement>) => React.ReactElement);
}

export interface GridItemProps {
  /**
   * Specifies the named grid area where the item should be placed.
   * Must match a named area defined in the parent Grid's templateAreas.
   */
  area?: string;

  /**
   * Defines the starting column line where the item should be placed.
   */
  colStart?: number | string;

  /**
   * Defines the ending column line where the item should be placed.
   */
  colEnd?: number | string;

  /**
   * Defines the starting row line where the item should be placed.
   */
  rowStart?: number | string;

  /**
   * Defines the ending row line where the item should be placed.
   */
  rowEnd?: number | string;

  /**
   * Specifies how many columns the item should span.
   */
  colSpan?: number | string;

  /**
   * Specifies how many rows the item should span.
   */
  rowSpan?: number | string;

  /**
   * Aligns the item along the inline (row) axis within its grid area.
   */
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';

  /**
   * Aligns the item along the block (column) axis within its grid area.
   */
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';

  /**
   * Allows rendering the grid item as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLDivElement>) => React.ReactElement);
}
