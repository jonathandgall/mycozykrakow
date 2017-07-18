var restaurantModel = {
  currentArray: [{
    name: '77 Sushi',
    lat: 50.0581635,
    lng: 19.9389086
  }, {
    name: 'Youmiko Sushi',
    lat: 50.0504222,
    lng: 19.943054
  }, {
    name: 'Zen Sushi',
    lat: 50.0621398,
    lng: 19.9417126
  }, {
    name: 'Urara',
    lat: 50.0643265802915,
    lng: 19.9408391802915
  }, {
    name: 'Youmiko Sushi',
    lat: 50.0569154,
    lng: 19.9324689
  }],

  //
}


var viewModel = {
    //exporting a copy of the current array so that it is shown as a list on my landing page
    restaurants: ko.observableArray(restaurantModel.currentArray.slice(0, restaurantModel.currentArray.length)),

      query: ko.observable(''),

      search: function(arg) {
        //removing current restaurants at the beginning of the loop
        viewModel.restaurants.removeAll();
        //check if value of arg exist in our model
        for (var i = 0; i < restaurantModel.currentArray.length; i++) {
          if (restaurantModel.currentArray[i].name.toLowerCase().indexOf(arg.toLowerCase()) >= 0) {
            viewModel.restaurants.push(restaurantModel.currentArray[i])
          }
        }
        console.log(arg)
      }
    };



    viewModel.query.subscribe(viewModel.search);


    ko.applyBindings(viewModel);
