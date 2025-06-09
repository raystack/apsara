export type WithAsChild<T> = Omit<T, "render"> & {
  asChild?: boolean;
};
