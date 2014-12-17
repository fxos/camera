export default class CaptureView {
	constructor(controller) {
		this.controller = controller;
		this.element = document.body;
		window.addEventListener('click', this.screenTapped.bind(this));
	}

	render(camera) {
		var videoEl = document.getElementById('viewfinder');
		videoEl.mozSrcObject = camera.camera;
		videoEl.play();
	}

	screenTapped(e) {
		// XXX: Some event?
		this.controller.screenTapped();
	}
}
