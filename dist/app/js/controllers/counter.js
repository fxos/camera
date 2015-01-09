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

  var Controller = _componentsMvcDistMvcJs.Controller;
  var CounterController = (function (Controller) {
    var CounterController = function CounterController(options) {
      var _this = this;
      Controller.call(this, options);

      this.model.on("recording", function () {
        _this.view.setRecording(_this.model.recording);
      });
    };

    _extends(CounterController, Controller);

    return CounterController;
  })(Controller);

  exports["default"] = CounterController;
});