/*eslint no-unused-vars: 0, no-unused-expr: 0*/
"use strict";

var should = require("should");

describe("process factories", function() {
  var angular;

  function assertions(example1) {
    // Factories with no dependencies
    example1.factories[0].name.should.be.equal("NoDependenciesService1");
    example1.factories[1].name.should.be.equal("NoDependenciesService2");
    example1.factories[0].deps.should.have.a.lengthOf(0);
    example1.factories[1].deps.should.have.a.lengthOf(0);

    // Factories with angular dependencies
    example1.factories[2].name.should.be.equal("OneAngularDependencyService1");
    example1.factories[3].name.should.be.equal("OneAngularDependencyService2");
    example1.factories[2].deps.should.have.a.lengthOf(1);
    example1.factories[3].deps.should.have.a.lengthOf(1);
    example1.factories[2].deps[0].should.be.equal("$http");
    example1.factories[3].deps[0].should.be.equal("$http");

    // Factories with angular and other dependencies
    example1.factories[4].name.should.be.equal("MixedDependenciesService1");
    example1.factories[5].name.should.be.equal("MixedDependenciesService2");
    example1.factories[4].deps.should.have.a.lengthOf(3);
    example1.factories[5].deps.should.have.a.lengthOf(3);

    // Controllers with no dependencies
    example1.controllers[0].name.should.be.equal("NoDependenciesCtrl1");
    example1.controllers[1].name.should.be.equal("NoDependenciesCtrl2");
    example1.controllers[0].deps.should.have.a.lengthOf(0);
    example1.controllers[1].deps.should.have.a.lengthOf(0);


    // Controllers with angular dependencies
    example1.controllers[2].name.should.be.equal("OneAngularDependencyCtrl1");
    example1.controllers[3].name.should.be.equal("OneAngularDependencyCtrl2");
    example1.controllers[2].deps.should.have.a.lengthOf(1);
    example1.controllers[3].deps.should.have.a.lengthOf(1);
    example1.controllers[2].deps[0].should.be.equal("$http");
    example1.controllers[3].deps[0].should.be.equal("$http");

    // Controllers with angular and other dependencies
    example1.controllers[4].name.should.be.equal("MixedDependenciesCtrl1");
    example1.controllers[5].name.should.be.equal("MixedDependenciesCtrl2");
    example1.controllers[4].deps.should.have.a.lengthOf(3);
    example1.controllers[5].deps.should.have.a.lengthOf(3);
  }

  describe("in chained definition", function () {
    beforeEach(function() {
      angular = require("../src/fake-angular")();
      require("../test-mocks/example1-chained")(angular);
    });

    it("process factories names and dependencies", function () {
      assertions(angular.modulesMap.example1);
    });
  });

  describe("in not-chained definition", function () {
    beforeEach(function() {
      angular = require("../src/fake-angular")();
      require("../test-mocks/example1")(angular);
    });

    it("process factories names and dependencies", function () {
      assertions(angular.modulesMap.example1);
    });
  });

  describe("parses options", function () {

    var options = {
      hideAngularServices: true
    };

    beforeEach(function()  {
      angular = require("../src/fake-angular")(options);
      require("../test-mocks/example1")(angular);
    });

    it("should hide angular services", function () {
      angular.options.hideAngularServices.should.be.equal(true);

      var MixedDependenciesCtrl1 = angular.modulesMap.example1.controllers[4];

      // Note, the $http dependency was excluded
      MixedDependenciesCtrl1.deps.should.have.a.lengthOf(2);
      MixedDependenciesCtrl1.deps[0].should.be.equal("ServiceX");
      MixedDependenciesCtrl1.deps[1].should.be.equal("ServiceY");
    });

  });

  describe("$inject usage", function() {
    var options = {
      hideAngularServices: false
    };

    beforeEach(function()  {
      angular = require("../src/fake-angular")(options);
      require("../test-mocks/example1")(angular);
    });

    it("should use $inject for deps over the function names", function() {
      var DollarSignInjectDependenciesService = angular.modulesMap.example1.factories[6];

      DollarSignInjectDependenciesService.deps.should.have.a.lengthOf(3);
      DollarSignInjectDependenciesService.deps[0].should.be.equal("$http");
      DollarSignInjectDependenciesService.deps[1].should.be.equal("ServiceX");
      DollarSignInjectDependenciesService.deps[2].should.be.equal("ServiceY");
    });
  });

  describe("components", function() {
    describe("hide angular services", function() {
      var options = {
        hideAngularServices: true
      };

      beforeEach(function()  {
        angular = require("../src/fake-angular")(options);
        require("../test-mocks/example1")(angular);
      });

      it('should parse dependencies from $inject array', function() {
        var dollarSignInjectComponent = angular.modulesMap.example1.components[0];
        dollarSignInjectComponent.deps.should.have.a.lengthOf(2);
        dollarSignInjectComponent.deps[0].should.be.equal("ServiceX");
        dollarSignInjectComponent.deps[1].should.be.equal("ServiceY");
      });

      it('should parse dependencies even when none are provided using only function args', function () {
        var noDependenciesCtrl1 = angular.modulesMap.example1.components[1];
        noDependenciesCtrl1.deps.should.have.a.lengthOf(0);
      });

      it('should parse dependencies even when none are provided using the array/function syntax', function () {
        var noDependenciesCtrl2 = angular.modulesMap.example1.components[2];
        noDependenciesCtrl2.deps.should.have.a.lengthOf(0);
      });

      it('should exclude angular services when parsing dependencies from the function args', function() {
        var mixedDependencyComponent1 = angular.modulesMap.example1.components[5];
        mixedDependencyComponent1.deps.should.have.a.lengthOf(2);
        mixedDependencyComponent1.deps[0].should.be.equal("ServiceX");
        mixedDependencyComponent1.deps[1].should.be.equal("ServiceY");
      });

      it('should exclude angular services when parsing dependencies from the array/function syntax', function() {
        var mixedDependencyComponent2 = angular.modulesMap.example1.components[6];
        mixedDependencyComponent2.deps.should.have.a.lengthOf(2);
        mixedDependencyComponent2.deps[0].should.be.equal("ServiceX");
        mixedDependencyComponent2.deps[1].should.be.equal("ServiceY");
      });
    });

    describe("don't hide angular services", function() {
      var options = {
        hideAngularServices: false
      };

      beforeEach(function()  {
        angular = require("../src/fake-angular")(options);
        require("../test-mocks/example1")(angular);
      });

      it('should parse dependencies from $inject array', function() {
        var dollarSignInjectComponent = angular.modulesMap.example1.components[0];
        dollarSignInjectComponent.deps.should.have.a.lengthOf(3);
        dollarSignInjectComponent.deps[0].should.be.equal("$http");
        dollarSignInjectComponent.deps[1].should.be.equal("ServiceX");
        dollarSignInjectComponent.deps[2].should.be.equal("ServiceY");
      });

      it('should parse dependencies even when none are provided using only function args', function () {
        var noDependenciesCtrl1 = angular.modulesMap.example1.components[1];
        noDependenciesCtrl1.deps.should.have.a.lengthOf(0);
      });

      it('should parse dependencies even when none are provided using the array/function syntax', function () {
        var noDependenciesCtrl2 = angular.modulesMap.example1.components[2];
        noDependenciesCtrl2.deps.should.have.a.lengthOf(0);
      });

      it('should include angular services when parsing dependencies from the function args', function() {
        var mixedDependencyComponent1 = angular.modulesMap.example1.components[5];
        mixedDependencyComponent1.deps.should.have.a.lengthOf(3);
        mixedDependencyComponent1.deps[0].should.be.equal("$http");
        mixedDependencyComponent1.deps[1].should.be.equal("ServiceX");
        mixedDependencyComponent1.deps[2].should.be.equal("ServiceY");
      });

      it('should include angular services when parsing dependencies from the array/function syntax', function() {
        var mixedDependencyComponent2 = angular.modulesMap.example1.components[6];
        mixedDependencyComponent2.deps.should.have.a.lengthOf(3);
        mixedDependencyComponent2.deps[0].should.be.equal("$http");
        mixedDependencyComponent2.deps[1].should.be.equal("ServiceX");
        mixedDependencyComponent2.deps[2].should.be.equal("ServiceY");
      });
    });
  });
});
