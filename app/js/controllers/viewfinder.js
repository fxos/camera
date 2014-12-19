import { Controller } from 'components/mvc/dist/mvc.js';

import DCFUtil from 'js/lib/dcf_util.js';

export default class ViewfinderController extends Controller {
	constructor(options) {
		super(options);

		this.pictureStorage = navigator.getDeviceStorage('pictures');
		this.camera = this.view.camera;
	}

	preview() {
		var activity = new window.MozActivity({
			name: 'browse',
			data: {
				type: 'photos'
			}
		});

		activity.onerror = function() {
			console.warn('Unable to launch Gallery');
		};
	}

	capture() {
		if (this.model.mode === 'picture') {
			this.camera.takePicture()
				.then((blob) => {
					this.view.setThumbnailImage(blob);

					DCFUtil.getNextFilename('pictures', (filename) => {
						var request = this.pictureStorage.addNamed(blob, filename);
						request.onsuccess = function() {
							var path = request.result;
							console.log('Picture saved to: ' + path);
						};
						request.onerror = function(error) {
							console.warn('Unable to save to DeviceStorage', error);
						};
					});
				})
				.catch((error) => {
					console.warn('Unable to capture', error);
				});
		}

		else {
			window.alert('Not yet implemented');
		}
	}

	mode() {
		this.model.toggleMode();
		this.view.setMode(this.model.mode);
	}
}
