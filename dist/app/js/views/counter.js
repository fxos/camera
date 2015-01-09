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

  var View = _componentsMvcDistMvcJs.View;
  var CounterView = (function (View) {
    var CounterView = function CounterView(options) {
      View.call(this, options);

      this.el.id = "counter-view";
      this.el.className = "hidden";

      this.time = 0;

      this.render();
    };

    _extends(CounterView, View);

    CounterView.prototype.init = function (controller) {
      var _this = this;
      View.prototype.init.call(this, controller);

      this.el.dataset.orientation = screen.mozOrientation;

      window.addEventListener("resize", function (evt) {
        _this.el.dataset.orientation = screen.mozOrientation;
      });
    };

    CounterView.prototype.render = function () {
      this.el.textContent = formatTime(this.time);
    };

    CounterView.prototype.setRecording = function (recording) {
      var _this2 = this;
      if (!recording) {
        clearInterval(this.renderInterval);
        this.el.classList.add("hidden");
        return;
      }

      var startTime = Date.now();

      this.time = 0;
      this.render();

      this.renderInterval = setInterval(function () {
        _this2.time = Date.now() - startTime;
        _this2.render();
      }, 1000);

      this.el.classList.remove("hidden");
    };

    return CounterView;
  })(View);

  exports["default"] = CounterView;


  function formatTime(time) {
    var seconds = Math.round(time / 1000 % 60);
    var minutes = Math.floor(time / 1000 / 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }
});