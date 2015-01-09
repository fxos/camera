import { View } from 'components/mvc/dist/mvc.js';

export default class CounterView extends View {
	constructor(options) {
		super(options);

		this.el.id = 'counter-view';
		this.el.className = 'hidden';

		this.time = 0;

		this.render();
	}

	init(controller) {
		super(controller);

		this.el.dataset.orientation = screen.mozOrientation;

		window.addEventListener('resize', (evt) => {
			this.el.dataset.orientation = screen.mozOrientation;
		});
	}

	render() {
		this.el.textContent = formatTime(this.time);
	}

	setRecording(recording) {
		if (!recording) {
			clearInterval(this.renderInterval);
			this.el.classList.add('hidden');
			return;
		}

		var startTime = Date.now();

		this.time = 0;
		this.render();

		this.renderInterval = setInterval(() => {
			this.time = Date.now() - startTime;
			this.render();
		}, 1000);

		this.el.classList.remove('hidden');
	}
}

function formatTime(time) {
	var seconds = Math.round(time / 1000 % 60);
	var minutes = Math.floor(time / 1000 / 60);
	return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
}
