define(["exports", "components/mvc/dist/mvc.js", "js/lib/dcf_util.js", "js/lib/video_util.js"], function (exports, _componentsMvcDistMvcJs, _jsLibDcfUtilJs, _jsLibVideoUtilJs) {
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
  var VideoUtil = _jsLibVideoUtilJs["default"];
  var ViewfinderController = (function (Controller) {
    var ViewfinderController = function ViewfinderController(options) {
      var _this = this;
      Controller.call(this, options);

      this.pictureStorage = navigator.getDeviceStorage("pictures");
      this.videoStorage = navigator.getDeviceStorage("videos");

      this.camera = this.view.camera;

      this.model.on("mode", function () {
        _this.view.setMode(_this.model.mode);
      });

      this.model.on("recording", function () {
        _this.view.setRecording(_this.model.recording);
      });
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
      var _this2 = this;
      if (this.model.mode === "picture") {
        this.camera.takePicture().then(function (blob) {
          _this2.view.setThumbnailImage(blob);

          DCFUtil.getNextFilename("pictures", function (filename) {
            var request = _this2.pictureStorage.addNamed(blob, filename);
            request.onsuccess = function () {
              var path = request.result;
              console.log("Picture saved to: " + path);
            };
            request.onerror = function (error) {
              console.warn("Unable to save to DeviceStorage", error);
            };
          });
        })["catch"](function (error) {
          console.warn("Unable to capture picture", error);
        });
      } else if (this.model.mode === "video") {
        if (this.camera.recording === "stopped") {
          DCFUtil.getNextFilename("videos", function (filename) {
            _this2.camera.startRecording(_this2.videoStorage, filename).then(function () {
              console.log("STARTED");
            })["catch"](function (error) {
              console.warn("Unable to start recording", error);
            });
          });
        } else if (this.camera.recording === "started") {
          this.camera.stopRecording().then(function (result) {
            var blob = result.blob;
            var filename = result.filename;


            VideoUtil.createVideoPoster(blob).then(function (posterBlob) {
              var posterFilename = filename.replace(".3gp", ".jpg");
              var request = _this2.pictureStorage.addNamed(posterBlob, posterFilename);
              request.onsuccess = function () {
                var path = request.result;
                console.log("Poster saved to: " + path);
              };
              request.onerror = function (error) {
                console.warn("Unable to save to DeviceStorage", error);
              };

              _this2.view.setThumbnailImage(posterBlob);
            })["catch"](function (error) {
              console.warn("Unable to create video poster", error);
            });

            console.log("STOPPED", blob, filename);
          })["catch"](function (error) {
            console.warn("Unable to capture video", error);
          });
        }
      }
    };

    ViewfinderController.prototype.mode = function () {
      this.model.toggleMode();
    };

    ViewfinderController.prototype.recordingStarted = function () {
      this.model.recording = true;
    };

    ViewfinderController.prototype.recordingStopped = function () {
      this.model.recording = false;
    };

    return ViewfinderController;
  })(Controller);

  exports["default"] = ViewfinderController;
});