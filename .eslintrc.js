module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  ignores: ["packages/raystack/dist/**/*/", "packages/raystack/coverage/**/*/"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
