import { Model } from 'components/mvc/dist/mvc.js';

export default class Configuration extends Model {
	constructor(properties) {
		super(properties);

		this.mode = 'picture';
	}

	toggleMode() {
		this.mode = this.mode === 'picture' ? 'video' : 'picture';
	}
}
