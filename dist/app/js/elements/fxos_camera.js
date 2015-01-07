define(["exports"], function (exports) {
  "use strict";

  (function (window) {
    "use strict";

    var cameras = navigator.mozCameras;

    var orientationAngles = {
      "portrait-primary": 0,
      "landscape-primary": 90,
      "portrait-secondary": 180,
      "landscape-secondary": 270
    };

    var proto = Object.create(HTMLElement.prototype);

    var template = "<style scoped>\n#container {\n\tbackground-color: #000;\n\tdisplay: block;\n\tposition: relative;\n\twidth: 100%;\n\theight: 100%;\n\tmin-height: 150px;\n}\n#video {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n}\n</style>\n<div id=\"container\">\n<video id=\"video\" autoplay></video>\n</div>";

    proto.play = function () {
      var _this = this;
      this.playing = true;

      this.getCamera().then(function (camera) {
        _this.video.mozSrcObject = camera;
      });
    };

    proto.stop = function () {
      if (this.camera) {
        this.camera.release();
        delete this.camera;
      }

      this.video.mozSrcObject = null;
      this.playing = false;
    };

    proto.getCamera = function () {
      var _this2 = this;
      return new Promise(function (resolve) {
        if (_this2.camera) {
          resolve(_this2.camera);
          return;
        }

        var cameraId = _this2.cameraId;
        var configuration = _this2.configuration;

        cameras.getCamera(cameraId, configuration).then(function (result) {
          _this2.camera = result.camera;
          _this2.configuration = result.configuration;

          updateDimensions(_this2);
          resolve(_this2.camera);
        });
      });
    };

    proto.setCameraId = function (cameraId) {
      this.cameraId = cameraId;
      // this.updateConfiguration();
    };

    proto.setMode = function (mode) {
      this.configuration.mode = mode;
      this.updateConfiguration();
    };

    proto.updateConfiguration = function () {
      var _this3 = this;
      this.getCamera().then(function (camera) {
        camera.setConfiguration(_this3.configuration);
      });
    };

    proto.takePicture = function () {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        _this4.getCamera().then(function (camera) {
          _this4.configuration.dateTime = Date.now() / 1000;

          camera.takePicture(_this4.configuration).then(function (blob) {
            delete _this4.configuration.dateTime;

            camera.resumePreview();
            resolve(blob);
          })["catch"](function (error) {
            reject(error);
          });
        });
      });
    };

    proto.startRecording = function (deviceStorage, path) {};

    proto.stopRecording = function () {};

    proto.createdCallback = function () {
      var _this5 = this;
      var shadow = this.createShadowRoot();
      shadow.innerHTML = template;

      this.container = shadow.querySelector("#container");
      this.video = shadow.querySelector("#video");

      this.cameraList = cameras.getListOfCameras();
      this.cameraId = this.cameraList[0];

      this.configuration = {
        mode: FXOSCamera.MODE_PICTURE
      };

      this.playing = false;

      window.addEventListener("resize", function () {
        return updateDimensions(_this5);
      });
    };

    function updateDimensions(element) {
      element.getCamera().then(function (camera) {
        var video = element.video;

        var sensorAngle = camera.sensorAngle;
        var orientation = orientationAngles[screen.mozOrientation];

        // Update the camera configuration so that pictures taken
        // are properly rotated.
        element.configuration.rotation = -orientation;

        var angle = sensorAngle - orientation;

        var containerWidth = element.offsetWidth;
        var containerHeight = element.offsetHeight;

        if (angle % 180 === 0) {
          video.style.top = "0px";
          video.style.left = "0px";
          video.style.width = containerWidth + "px";
          video.style.height = containerHeight + "px";
        } else {
          video.style.top = ((containerHeight - containerWidth) / 2) + "px";
          video.style.left = ((containerWidth - containerHeight) / 2) + "px";
          video.style.width = containerHeight + "px";
          video.style.height = containerWidth + "px";
        }

        video.style.transform = "rotate(" + angle + "deg)";
      });
    }

    var FXOSCamera = document.registerElement("fxos-camera", {
      prototype: proto
    });

    FXOSCamera.MODE_PICTURE = "picture";
    FXOSCamera.MODE_VIDEO = "video";

    window.FXOSCamera = FXOSCamera;
  })(window);
});