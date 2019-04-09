"use strict";

function parseAngularDeps (angularDeps) {
  var deps, definition, angularDepsStr, depsProcessed = [];
  if (angularDeps instanceof Array) { //Respect your elders (handles the array/function syntax for dependencies)
    definition = angularDeps.length === 0 ? undefined : angularDeps[angularDeps.length - 1]; //Definition is always the last element of the array
    deps = angularDeps.length > 1 ? angularDeps.slice(0, angularDeps.length - 1) : []; //dependencies are everything except the last element of the array
  } else if (angularDeps instanceof Function) {
    definition = angularDeps;
    if (definition.$inject) { //For the heroes who are doing minification like good way (handles $inject array for dependencies)
      deps = definition.$inject;
    } else { //For the people who are getting by with unminified JS (handles just function arguments)
      // We just care about the wrapper function to the dependencies
      angularDepsStr = "" + angularDeps;
      angularDepsStr = angularDepsStr.slice(0, angularDepsStr.indexOf("{"));
      deps = /\(([^)]+)/.exec(angularDepsStr);
      if (deps && deps.length && deps[ 1 ]) {
        deps = deps[1].split(/\s*,\s*/);
      } else {
        deps = [];
      }
    }
  }
  if (deps && deps.length) {
    deps.forEach(function (dep) {
      dep = dep.trim();
      depsProcessed.push(dep);
    });
  }
  return { deps: depsProcessed, definition: definition };
}

var noop = function() {};

module.exports = {
  parseAngularDeps: parseAngularDeps,
  noop            : noop
};
