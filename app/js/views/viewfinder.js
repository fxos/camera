import { View } from 'components/mvc/dist/mvc.js';

import 'js/elements/fxos_camera.js';

var template = `<fxos-camera autoplay></fxos-camera>
<div class="controls">
	<button type="button" data-action="preview" disabled>
		<img class="thumbnail" alt="">
	</button>
	<button type="button" data-action="capture">Capture</button>
	<button type="button" data-action="mode">Picture</button>
</div>`;

export default class ViewfinderView extends View {
	constructor(options) {
		super(options);

		this.render();
	}

	init(controller) {
		super(controller);

		this.camera    = this.$('fxos-camera');
		this.controls  = this.$('.controls');
		this.preview   = this.$('[data-action="preview"]');
		this.capture   = this.$('[data-action="capture"]');
		this.mode      = this.$('[data-action="mode"]');
		this.thumbnail = this.$('.thumbnail');

		this.camera.play();

		this.controls.dataset.orientation = screen.mozOrientation;

		this.on('click', 'button', (evt) => {
			var action = this.controller[evt.target.dataset.action];
			if (typeof action === 'function') {
				action.call(this.controller);
			}
		});

		this.on('recordingstarted', 'fxos-camera', (evt) => {
			this.controller.recordingStarted();
		});

		this.on('recordingstopped', 'fxos-camera', (evt) => {
			this.controller.recordingStopped();
		});

		document.addEventListener('visibilitychange', (evt) => {
			if (document.hidden) {
				this.camera.stop();
			} else {
				this.camera.play();
			}
		});

		window.addEventListener('resize', (evt) => {
			this.controls.dataset.orientation = screen.mozOrientation;
		});
	}

	template() {
		return template;
	}

	render() {
		super();

		this.el.appendChild(this.counterView.el);
	}

	setThumbnailImage(blob) {
		if (this.thumbnail.src) {
			URL.revokeObjectURL(this.thumbnail.src);
		}

		this.thumbnail.src = URL.createObjectURL(blob);
		this.preview.removeAttribute('disabled');
	}

	setMode(mode) {
		this.camera.setMode(mode);
		this.mode.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
	}

	setRecording(recording) {
		this.preview.disabled = recording;
		this.mode.disabled = recording;

		this.capture.textContent = recording ? 'Stop' : 'Capture';
	}
}
