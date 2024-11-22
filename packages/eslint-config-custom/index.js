
module.exports = {
  extends: ["next", "turbo", "prettier"],
  plugins: [ "simple-import-sort" ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/display-name": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")]
    },
  },
};
