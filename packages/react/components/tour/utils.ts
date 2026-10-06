export interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectsEqual(a: SpotlightRect, b: SpotlightRect) {
  return (
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}
