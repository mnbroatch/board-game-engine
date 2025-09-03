const common = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'yarn-bound.min.js',
    library: {
      name: 'YarnBound',
      type: 'umd'
    },
    globalObject: 'this'
  },
  module: {
    rules: [{
      test: /\.(js|ts)$/,
      exclude: /node_modules\/(?!@mnbroatch).+/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-typescript',
            ['@babel/preset-env',
              {
                modules: 'cjs',
                targets: 'last 4 years'
              }
            ],
          ],
          plugins: ['add-module-exports']
        }
      }
    }]
  },
  resolve: { extensions: [".js",".ts",".tsx",".jsx",".json"] },
}

module.exports = [
  common,
  {
    ...common,
    output: {
      ...common.output,
      filename: 'yarn-bound.js'
    },
    optimization: {
      ...common.optimization,
      minimize: false
    }
  },
]
