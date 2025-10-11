// ==============================
// ⚙️ Babel config para Jest + ESM
// ==============================
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
