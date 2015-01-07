import Configuration from 'js/models/configuration.js';

import CounterController from 'js/controllers/counter.js';
import CounterView from 'js/views/counter.js';

import ViewfinderController from 'js/controllers/viewfinder.js';
import ViewfinderView from 'js/views/viewfinder.js';

var configuration = new Configuration();

var counterView = new CounterView();
var viewfinderView = new ViewfinderView({
	el: document.getElementById('viewfinder-view'),
	counterView: counterView
});

new CounterController({
	view: counterView,
	model: configuration
});

new ViewfinderController({
	view: viewfinderView,
	model: configuration
});
