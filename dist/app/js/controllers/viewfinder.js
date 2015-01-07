define(["exports", "components/mvc/dist/mvc.js", "js/lib/dcf_util.js"], function (exports, _componentsMvcDistMvcJs, _jsLibDcfUtilJs) {
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
  var DCFUtil = _jsLibDcfUtilJs["default"];
  var ViewfinderController = (function (Controller) {
    var ViewfinderController = function ViewfinderController(options) {
      Controller.call(this, options);

      this.pictureStorage = navigator.getDeviceStorage("pictures");
      this.camera = this.view.camera;
    };

    _extends(ViewfinderController, Controller);

    ViewfinderController.prototype.preview = function () {
      var activity = new window.MozActivity({
        name: "browse",
        data: {
          type: "photos"
        }
      });

      activity.onerror = function () {
        console.warn("Unable to launch Gallery");
      };
    };

    ViewfinderController.prototype.capture = function () {
      var _this = this;
      if (this.model.mode === "picture") {
        this.camera.takePicture().then(function (blob) {
          _this.view.setThumbnailImage(blob);

          DCFUtil.getNextFilename("pictures", function (filename) {
            var request = _this.pictureStorage.addNamed(blob, filename);
            request.onsuccess = function () {
              var path = request.result;
              console.log("Picture saved to: " + path);
            };
            request.onerror = function (error) {
              console.warn("Unable to save to DeviceStorage", error);
            };
          });
        })["catch"](function (error) {
          console.warn("Unable to capture", error);
        });
      } else {
        window.alert("Not yet implemented");
      }
    };

    ViewfinderController.prototype.mode = function () {
      this.model.toggleMode();
      this.view.setMode(this.model.mode);
    };

    return ViewfinderController;
  })(Controller);

  exports["default"] = ViewfinderController;
});