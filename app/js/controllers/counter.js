import { Controller } from 'components/mvc/dist/mvc.js';

export default class CounterController extends Controller {
	constructor(options) {
		super(options);

		this.model.on('recording', () => {
			this.view.setRecording(this.model.recording);
		});
	}
}
