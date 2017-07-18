//model for restaurants in krakow
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
    name: 'Edo Sushi Bar',
    lat: 50.0521837,
    lng: 19.9429686
  }],
}

//implementing google maps
var map;

function initMap() {
  //creating a new map with the google maps constructor, defining it with it's center and zoom attribute
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 50.06193,
      lng: 19.94
    },
    zoom: 13
  });

  //implemeting a loop in order to retrieve the markers from the model and show them in the view
  for (var i = 0; i < restaurantModel.currentArray.length ; i++) {
    restaurantModel.currentArray[i].marker = new google.maps.Marker({
      map: map,
      position: {
        lat: restaurantModel.currentArray[i].lat,
        lng: restaurantModel.currentArray[i].lng
      },
      title: restaurantModel.currentArray[i].name
    });
  }
}


var viewModel = {
  //exporting a copy of the current array so that it is shown as a list on my landing page
  restaurants: ko.observableArray(restaurantModel.currentArray.slice(0, restaurantModel.currentArray.length)),

  query: ko.observable(''),

  search: function(arg) {
    //removing current restaurants at the beginning of the loop
    viewModel.restaurants.removeAll();
    //check if value of arg exist in our model and adding/removing the marker depending on its existence
    for (var i = 0; i < restaurantModel.currentArray.length; i++) {
      if (restaurantModel.currentArray[i].name.toLowerCase().indexOf(arg.toLowerCase()) >= 0) {
        viewModel.restaurants.push(restaurantModel.currentArray[i]);
        //putting back the marker when there is a match
          restaurantModel.currentArray[i].marker.setMap(map)
      } else {
        //removing the marker when there is no match
        restaurantModel.currentArray[i].marker.setMap(null)
      }
    }
  }
};

//create event notification mechanism. when the query changes, the search is invoked.
viewModel.query.subscribe(viewModel.search);

ko.applyBindings(viewModel);
