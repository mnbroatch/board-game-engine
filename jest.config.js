module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|ts)$': ['babel-jest', {
      presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', {
          modules: 'cjs',
          targets: { node: 'current' }
        }]
      ],
      plugins: ['add-module-exports']
    }]
  },
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts', 'json'],
  testMatch: [
    '**/__tests__/**/*.(js|ts)',
    '**/*.(test|spec).(js|ts)'
  ]
}
