# Angular Inject Graph

This project is a node utility that analyses an angular project and exports a graph with the project's architecture: modules, controllers, directives, components and filters.

## How to use it:

1. Require the module:

  ```js
  var angularInjectGraph = require('angular-inject-graph'),
  ])
  ```

2. Call it with your project code:

  ```js
  var deps = angularInjectGraph([
    { id: 'file1.js', text: '<angular code here in a string>' },
    { id: 'file2.js', text: '<angular code here in a string>' }
  ])
  ```

It was designed with grunt in mind. Use it with [grunt-angular-modules-graph](https://github.com/lucalanca/grunt-angular-modules-graph).

3. Do whatever you want with the resulted graph object

## About

This project was originally forked from , extracted from [@carlo-colombo's](https://github.com/carlo-colombo) [angular-modules-graph](https://github.com/carlo-colombo/angular-modules-graph),
then forked again from [@lucalanca's](https://github.com/lucalanca) [angular-architecture-graph](https://github.com/lucalanca/angular-architecture-graph)

## License:
MIT
