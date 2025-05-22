import { Grid as GridPrimitive } from "./grid";
import { GridItem } from "./grid-item";

export const Grid = Object.assign(GridPrimitive, {
  Item: GridItem,
});
