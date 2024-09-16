const { types } = require('util');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],

  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '**/*spec.ts'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }], // 함수의 반환 타입 명시
    '@typescript-eslint/no-explicit-any': 'warn', // any 사용시 경고
    'import/order': [
      // import 순서 정렬
      'error',
      {
        alphabetize: {
          order: 'asc', //alphaber 순서로 정렬
        },
        'newlines-between': 'always', // 그룹 별 newline 으로 구분
        //그룹은 기본 ["builtin", "external", "parent", "sibling", "index"] 순서입니다. 변경 가능
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
