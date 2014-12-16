export default class Viewfinder {
	constructor() {
		this.config = {
			mode: 'picture',
			recorderProfile: 'jpg',
			previewSize: {
				width: 352,
				height: 288
			}
		};
	}

	init() {
		return new Promise((resolve, reject) => {
			var instance = navigator.mozCameras.getListOfCameras()[0];
			navigator.mozCameras.getCamera(instance, this.config).then(
				params => {
					this.configuration = params.configuration;
					this.camera = params.camera;
					resolve();
				});
		});
	}

	render(videoEl) {
		videoEl.mozSrcObject = this.camera;
		videoEl.play();
	}
}