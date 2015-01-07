define(["exports", "components/mvc/dist/mvc.js"], function (exports, _componentsMvcDistMvcJs) {
  "use strict";

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var Model = _componentsMvcDistMvcJs.Model;
  var Configuration = (function (Model) {
    var Configuration = function Configuration(properties) {
      Model.call(this, properties);

      this.mode = "picture";
    };

    _extends(Configuration, Model);

    Configuration.prototype.toggleMode = function () {
      this.mode = this.mode === "picture" ? "video" : "picture";
    };

    return Configuration;
  })(Model);

  exports["default"] = Configuration;
});