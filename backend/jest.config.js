// ==============================
// ⚙️ jest.config.js
// Configuración de Jest – ServiGo
// ==============================
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  moduleFileExtensions: ["js", "json"],
};
