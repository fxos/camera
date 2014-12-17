export default class CameraModel {
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

	get() {
		var instance = navigator.mozCameras.getListOfCameras()[0];
		return new Promise(resolve => {
			navigator.mozCameras.getCamera(instance, this.config).then(
				params => {
					this.configuration = params.configuration;
					this.camera = params.camera;
					resolve(this);
				});
		});
	}
}