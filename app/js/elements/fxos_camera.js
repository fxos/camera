(function(window) {
'use strict';

var cameras = navigator.mozCameras;

var orientationAngles = {
	'portrait-primary':    0,
	'landscape-primary':   90,
	'portrait-secondary':  180,
	'landscape-secondary': 270
};

var proto = Object.create(HTMLElement.prototype);

var template =
`<style scoped>
#container {
	background-color: #000;
	display: block;
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 150px;
}
#video {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
<div id="container">
<video id="video" autoplay></video>
</div>`;

proto.play = function() {
	this.getCamera().then((camera) => {
		this.video.mozSrcObject = camera;
	});

	this.playing = true;
};

proto.stop = function() {
	this.video.mozSrcObject = null;
	this.playing = false;
};

proto.getCamera = function() {
	return new Promise((resolve) => {
		if (this.camera) {
			resolve(this.camera);
			return;
		}

		var cameraId = this.cameraId;
		var configuration = this.configuration;

		cameras.getCamera(cameraId, configuration).then((result) => {
			this.camera = result.camera;
			this.configuration = result.configuration;

			updateDimensions(this);
			resolve(this.camera);
		});
	});
};

proto.setCameraId = function(cameraId) {
	this.cameraId = cameraId;
	// this.updateConfiguration();
};

proto.setMode = function(mode) {
	this.configuration.mode = mode;
	this.updateConfiguration();
};

proto.updateConfiguration = function() {
	this.getCamera().then((camera) => {
		camera.setConfiguration(this.configuration);
	});
};

proto.takePicture = function() {
	return new Promise((resolve, reject) => {
		this.getCamera().then((camera) => {
			this.configuration.dateTime = Date.now() / 1000;

			camera.takePicture(this.configuration).then((blob) => {
				delete this.configuration.dateTime;

				camera.resumePreview();
				resolve(blob);
			}).catch((error) => {
				reject(error);
			});
		});
	});
};

proto.startRecording = function(deviceStorage, path) {

};

proto.stopRecording = function() {

};

proto.createdCallback = function() {
	var shadow = this.createShadowRoot();
	shadow.innerHTML = template;

	this.container = shadow.querySelector('#container');
	this.video     = shadow.querySelector('#video');

	this.cameraList = cameras.getListOfCameras();
	this.cameraId = this.cameraList[0];

	this.configuration = {
		mode: FXOSCamera.MODE_PICTURE
	};

	this.playing = false;

	if (this.getAttribute('autoplay') !== null) {
		this.play();
	}

	window.addEventListener('resize', () => updateDimensions(this));
};

function updateDimensions(element) {
	element.getCamera().then((camera) => {
		var video  = element.video;

		var sensorAngle = camera.sensorAngle;
		var orientation = orientationAngles[screen.mozOrientation];

		// Update the camera configuration so that pictures taken
		// are properly rotated.
		element.configuration.rotation = -orientation;

		var angle = sensorAngle - orientation;

		var containerWidth  = element.offsetWidth;
		var containerHeight = element.offsetHeight;

		if (angle % 180 === 0) {
			video.style.top    = '0px';
			video.style.left   = '0px';
			video.style.width  = containerWidth  + 'px';
			video.style.height = containerHeight + 'px';
		} else {
			video.style.top    = ((containerHeight - containerWidth) / 2) + 'px';
			video.style.left   = ((containerWidth - containerHeight) / 2) + 'px';
			video.style.width  = containerHeight + 'px';
			video.style.height = containerWidth  + 'px';
		}

		video.style.transform = 'rotate(' + angle + 'deg)';
	});
}

var FXOSCamera = document.registerElement('fxos-camera', {
	prototype: proto
});

FXOSCamera.MODE_PICTURE = 'picture';
FXOSCamera.MODE_VIDEO   = 'video';

window.FXOSCamera = FXOSCamera;

})(window);
