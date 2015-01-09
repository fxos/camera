function createVideoPoster(blob) {
	return new Promise((resolve, reject) => {
		var url = URL.createObjectURL(blob);
		var video = document.createElement('video');
		video.preload = 'metadata';
		video.onloadeddata = function() {
			var canvas = document.createElement('canvas');
			canvas.width  = video.videoWidth;
			canvas.height = video.videoHeight;

			var ctx = canvas.getContext('2d', { willReadFrequently: true });
			ctx.drawImage(video, 0, 0);

			video.onerror = null;
			video.src = null;
			video.load();

			URL.revokeObjectURL(url);

			canvas.toBlob((posterBlob) => {
				canvas.width  = 0;
				canvas.height = 0;

				canvas = ctx = null;

				resolve(posterBlob);
			}, 'image/jpeg');
		};
		video.onerror = function(error) {
			video.src = null;
			video.load();

			URL.revokeObjectURL(url);

			reject(error);
		};

		video.src = url;
	});
}

var VideoUtil = {
	createVideoPoster: createVideoPoster
};

export default VideoUtil;
