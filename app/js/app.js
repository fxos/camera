import Viewfinder from 'dist/viewfinder.js';

var videoEl = document.getElementById('viewfinder');
var viewfinder = new Viewfinder();
viewfinder.init()
	.then(viewfinder.render.bind(viewfinder, videoEl));
