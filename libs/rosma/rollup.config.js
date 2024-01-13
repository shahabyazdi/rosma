// const { terser } = require('rollup-plugin-terser');

module.exports = function (options) {
  const extraGlobals = { react: 'React' };

  options.output = {
    ...options.output,
    globals: { ...options.output.globals, ...extraGlobals },
    // plugins: [terser()],
  };

  return options;
};
