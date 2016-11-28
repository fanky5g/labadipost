(function TypeOf(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.axis = factory();
  }
}(this, () => {
  'use strict';
  const exports = {};
  const types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ');

  const type = function Type() {
    return Object.prototype.toString.call(this).slice(8, -1);
  };

  for (let i = types.length; i--;) {
    exports[`is${types[i]}`] = (self => elem => type.call(elem) === self)(types[i]);
  }
  return exports;
}));
