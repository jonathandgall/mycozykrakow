//model for restaurants in krakow
var restaurantModel = {
  currentArray: [{
    name: '77 Sushi',
    lat: 50.0581635,
    lng: 19.9389086,
    contentString: '<div class="infowindow-render">Good Sushi</div>'
  }, {
    name: 'Youmiko Sushi',
    lat: 50.0504222,
    lng: 19.943054,
    contentString: '<div class="infowindow-render">Good Sushi</div>'
  }, {
    name: 'Zen Sushi',
    lat: 50.0621398,
    lng: 19.9417126,
    contentString: '<div class="infowindow-render">Good Sushi</div>'
  }, {
    name: 'Urara',
    lat: 50.0643265802915,
    lng: 19.9408391802915,
    contentString: '<div class="infowindow-render">Good Sushi</div>'
  }, {
    name: 'Edo Sushi Bar',
    lat: 50.0521837,
    lng: 19.9429686,
    contentString: '<div class="infowindow-render">Better Sushi</div>'
  }],
}

//factorizing bounce in its own set
function bounceMarker(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null)
    }, 2000);
  }
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

  //implementing a loop in order to retrieve the markers from the model and show them in the view
  for (var i = 0; i < restaurantModel.currentArray.length; i++) {
    restaurantModel.currentArray[i].marker = new google.maps.Marker({
      map: map,
      animation: null,
      position: {
        lat: restaurantModel.currentArray[i].lat,
        lng: restaurantModel.currentArray[i].lng
      },
      title: restaurantModel.currentArray[i].name,
    });
    waitClickMarker(restaurantModel.currentArray[i].marker);


    //putting marker event listener to trigger bounce
    function waitClickMarker(marker) {
      marker.addListener('click', function(){bounceMarker(marker)})
    };

  };
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
  },


  showInfoWindow: function(arg) {
    var infowindow = new google.maps.InfoWindow({
      content: arg.contentString
    });
    bounceMarker(arg.marker)

    infowindow.open(map, arg.marker);
  }


};

//create event notification mechanism. when the query changes, the search is invoked.
viewModel.query.subscribe(viewModel.search);

ko.applyBindings(viewModel);
