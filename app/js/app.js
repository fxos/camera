import ViewfinderController from 'js/controllers/viewfinder.js';
import ViewfinderView from 'js/views/viewfinder.js';
import Configuration from 'js/models/configuration.js';

var viewfinderController = new ViewfinderController({
	view: new ViewfinderView({
		el: document.getElementById('viewfinder-view')
	}),
	model: new Configuration()
});

console.log(viewfinderController);
