define(["exports", "js/models/configuration.js", "js/controllers/counter.js", "js/views/counter.js", "js/controllers/viewfinder.js", "js/views/viewfinder.js"], function (exports, _jsModelsConfigurationJs, _jsControllersCounterJs, _jsViewsCounterJs, _jsControllersViewfinderJs, _jsViewsViewfinderJs) {
  "use strict";

  var Configuration = _jsModelsConfigurationJs["default"];
  var CounterController = _jsControllersCounterJs["default"];
  var CounterView = _jsViewsCounterJs["default"];
  var ViewfinderController = _jsControllersViewfinderJs["default"];
  var ViewfinderView = _jsViewsViewfinderJs["default"];


  var configuration = new Configuration();

  var counterView = new CounterView();
  var viewfinderView = new ViewfinderView({
    el: document.getElementById("viewfinder-view"),
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
});