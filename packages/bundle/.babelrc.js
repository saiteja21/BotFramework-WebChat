const { resolve } = require('path');

const packagePath = resolve(process.cwd(), './package.json');
const { version } = require(packagePath);

module.exports = {
  env: {
    test: {
      plugins: [
        'babel-plugin-istanbul'
      ]
    }
  },
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    ['babel-plugin-transform-define', {
      VERSION: version
    }]
  ],
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 versions']
      },
      modules: 'commonjs'
    }],
    '@babel/react'
  ]
};
