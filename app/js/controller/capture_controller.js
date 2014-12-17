import CameraModel from 'dist/model/camera_model.js';
import CaptureView from 'dist/view/capture_view.js';

export default class CaptureController {
	constructor() {
		this.model = new CameraModel();
		this.view = new CaptureView(this);
	}

	main() {
		this.model.get().then(camera => {
			this.view.render(camera);
		});
	}

	screenTapped() {
		window.alert('take a picture or something.');
	}
}
