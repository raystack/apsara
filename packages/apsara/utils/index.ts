export const deepMerge = (target: any, source: any) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }

  Object.assign(target || {}, source);
  return target;
};
