module.exports = {
  preset: "ts-jest",
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

// module.exports = {
//   transform: { "^.+\\.ts?$": "ts-jest" },
//   testEnvironment: "node",
//   testRegex: "/src/test/.*\\.(test|spec)?\\.(ts|tsx)$",
//   moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
// };
