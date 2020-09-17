const baseConfig = require("../../jest.config.base");

const packageName = require("./package.json").name.split("@apsara/").pop();

module.exports = {
  ...baseConfig,
  roots: [`<rootDir>/packages/apsara-${packageName}`],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  // setupFiles: [
  //   `<rootDir>/packages/${packageName}/jest/polyfills.ts`,
  //   `<rootDir>/packages/${packageName}/jest/setupEnzyme.ts`,
  // ],
  testRegex: `(packages/apsara-${packageName}/.*/__tests__/.*|\\.(test|spec))\\.tsx?$`,
  testURL: "http://localhost/",
  moduleDirectories: ["node_modules"],
  modulePaths: [`<rootDir>/packages/apsara-${packageName}/src/`],
  // snapshotSerializers: ["enzyme-to-json/serializer"],
  name: `apsara-${packageName}`,
  displayName: `apsara-${packageName}`,
  rootDir: "../..",
};
