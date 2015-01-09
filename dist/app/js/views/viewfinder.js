define(["exports", "components/mvc/dist/mvc.js", "js/elements/fxos_camera.js"], function (exports, _componentsMvcDistMvcJs, _jsElementsFxosCameraJs) {
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


  var template = "<fxos-camera autoplay></fxos-camera>\n<div class=\"controls\">\n\t<button type=\"button\" data-action=\"preview\" disabled>\n\t\t<img class=\"thumbnail\" alt=\"\">\n\t</button>\n\t<button type=\"button\" data-action=\"capture\">Capture</button>\n\t<button type=\"button\" data-action=\"mode\">Picture</button>\n</div>";

  var ViewfinderView = (function (View) {
    var ViewfinderView = function ViewfinderView(options) {
      View.call(this, options);

      this.render();
    };

    _extends(ViewfinderView, View);

    ViewfinderView.prototype.init = function (controller) {
      var _this = this;
      View.prototype.init.call(this, controller);

      this.camera = this.$("fxos-camera");
      this.controls = this.$(".controls");
      this.preview = this.$("[data-action=\"preview\"]");
      this.capture = this.$("[data-action=\"capture\"]");
      this.mode = this.$("[data-action=\"mode\"]");
      this.thumbnail = this.$(".thumbnail");

      this.camera.play();

      this.controls.dataset.orientation = screen.mozOrientation;

      this.on("click", "button", function (evt) {
        var action = _this.controller[evt.target.dataset.action];
        if (typeof action === "function") {
          action.call(_this.controller);
        }
      });

      this.on("recordingstarted", "fxos-camera", function (evt) {
        _this.controller.recordingStarted();
      });

      this.on("recordingstopped", "fxos-camera", function (evt) {
        _this.controller.recordingStopped();
      });

      document.addEventListener("visibilitychange", function (evt) {
        if (document.hidden) {
          _this.camera.stop();
        } else {
          _this.camera.play();
        }
      });

      window.addEventListener("resize", function (evt) {
        _this.controls.dataset.orientation = screen.mozOrientation;
      });
    };

    ViewfinderView.prototype.template = function () {
      return template;
    };

    ViewfinderView.prototype.render = function () {
      View.prototype.render.call(this);

      this.el.appendChild(this.counterView.el);
    };

    ViewfinderView.prototype.setThumbnailImage = function (blob) {
      if (this.thumbnail.src) {
        URL.revokeObjectURL(this.thumbnail.src);
      }

      this.thumbnail.src = URL.createObjectURL(blob);
      this.preview.removeAttribute("disabled");
    };

    ViewfinderView.prototype.setMode = function (mode) {
      this.camera.setMode(mode);
      this.mode.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    };

    ViewfinderView.prototype.setRecording = function (recording) {
      this.preview.disabled = recording;
      this.mode.disabled = recording;

      this.capture.textContent = recording ? "Stop" : "Capture";
    };

    return ViewfinderView;
  })(View);

  exports["default"] = ViewfinderView;
});