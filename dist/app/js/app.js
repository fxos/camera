define(["exports", "js/controllers/viewfinder.js", "js/views/viewfinder.js", "js/models/configuration.js"], function (exports, _jsControllersViewfinderJs, _jsViewsViewfinderJs, _jsModelsConfigurationJs) {
  "use strict";

  var ViewfinderController = _jsControllersViewfinderJs["default"];
  var ViewfinderView = _jsViewsViewfinderJs["default"];
  var Configuration = _jsModelsConfigurationJs["default"];


  var viewfinderController = new ViewfinderController({
    view: new ViewfinderView({
      el: document.getElementById("viewfinder-view")
    }),
    model: new Configuration()
  });

  console.log(viewfinderController);
});