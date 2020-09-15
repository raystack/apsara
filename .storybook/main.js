const path = require("path");
module.exports = {
  stories: ["../packages/**/*.stories.[tj]sx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-links"],
  typescript: {
    check: true,
    checkOptions: {},
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => ["label", "disabled"].includes(prop.name),
    },
  },
};
