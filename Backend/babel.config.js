// babel.config.js
export default {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
      modules: 'auto'
    }]
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'  // Asegúrate de que esto esté configurado
  ]
};
