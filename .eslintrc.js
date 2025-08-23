module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  plugins: [
    '@typescript-eslint',
    'n8n-nodes-base'
  ],
  rules: {
    // Nur funktionierende n8n Regeln verwenden
    'n8n-nodes-base/node-param-display-name-miscased': 'error',
    
    // TypeScript Regeln
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    
    // Console statements nur warnen (sind manchmal nötig für debugging)
    'no-console': 'warn'
  },
  ignorePatterns: [
    'dist/**/*',
    'node_modules/**/*',
    '*.js',
    'gulpfile.js'
  ]
};