module.exports = {
  plugins: [],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["last 2 versions"]
        }
      }
    ]
  ]
};
