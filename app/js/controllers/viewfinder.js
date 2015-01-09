import { Controller } from 'components/mvc/dist/mvc.js';

import DCFUtil from 'js/lib/dcf_util.js';
import VideoUtil from 'js/lib/video_util.js';

export default class ViewfinderController extends Controller {
	constructor(options) {
		super(options);

		this.pictureStorage = navigator.getDeviceStorage('pictures');
		this.videoStorage   = navigator.getDeviceStorage('videos');

		this.camera = this.view.camera;

		this.model.on('mode', () => {
			this.view.setMode(this.model.mode);
		});

		this.model.on('recording', () => {
			this.view.setRecording(this.model.recording);
		});
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
					console.warn('Unable to capture picture', error);
				});
		}

		else if (this.model.mode === 'video') {
			if (this.camera.recording === 'stopped') {
				DCFUtil.getNextFilename('videos', (filename) => {
					this.camera.startRecording(this.videoStorage, filename)
						.then(() => {
							console.log('STARTED');
						})
						.catch((error) => {
							console.warn('Unable to start recording', error);
						});
				});
			}

			else if (this.camera.recording === 'started') {
				this.camera.stopRecording()
					.then((result) => {
						var { blob, filename } = result;

						VideoUtil.createVideoPoster(blob)
							.then((posterBlob) => {
								var posterFilename = filename.replace('.3gp', '.jpg');
								var request = this.pictureStorage.addNamed(posterBlob, posterFilename);
								request.onsuccess = function() {
									var path = request.result;
									console.log('Poster saved to: ' + path);
								};
								request.onerror = function(error) {
									console.warn('Unable to save to DeviceStorage', error);
								};

								this.view.setThumbnailImage(posterBlob);
							})
							.catch((error) => {
								console.warn('Unable to create video poster', error);
							});

						console.log('STOPPED', blob, filename);
					})
					.catch((error) => {
						console.warn('Unable to capture video', error);
					});
			}
		}
	}

	mode() {
		this.model.toggleMode();
	}

	recordingStarted() {
		this.model.recording = true;
	}

	recordingStopped() {
		this.model.recording = false;
	}
}
