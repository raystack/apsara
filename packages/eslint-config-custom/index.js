
module.exports = {
  extends: ["next", "turbo", "prettier"],
  plugins: [ "simple-import-sort" ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/display-name": "off",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "import/order": "warn"
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")]
    },
  },
};
