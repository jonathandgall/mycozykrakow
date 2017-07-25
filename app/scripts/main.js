//model for restaurants in krakow
var restaurantModel = {
  currentArray: [{
    name: '77 Sushi',
    lat: 50.0581635,
    lng: 19.9389086,
    f2venueid: '4bd5e3797b1876b074908b86'
  }, {
    name: 'Youmiko Sushi',
    lat: 50.0504222,
    lng: 19.943054,
    f2venueid: '56193c32498e5b08a853b2e6'
  }, {
    name: 'Zen Sushi',
    lat: 50.0621398,
    lng: 19.9417126,
    f2venueid: '4b61bd41f964a520b31f2ae3'
  }, {
    name: 'Urara',
    lat: 50.0643265802915,
    lng: 19.9408391802915,
    f2venueid: '57652bda498ecdeadd38c82e'
  }, {
    name: 'Edo Sushi Bar',
    lat: 50.0521837,
    lng: 19.9429686,
    f2venueid: '4c2773e55c5ca5938cc247fe'
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
      marker.addListener('click', function() {
        bounceMarker(marker);
        var correctRestaurant;
        for (var i = 0; i < restaurantModel.currentArray.length; i++) {
          if (restaurantModel.currentArray[i].marker == marker) {
            correctRestaurant = restaurantModel.currentArray[i]
          };
        }
        showInfoWindow(correctRestaurant);
      })
    };
  };
}

//showing infowindow with data from foursquare
function showInfoWindow(restaurant) {
  $.getJSON('https://arpi.foursquare.com/v2/venues/' + restaurant.f2venueid + '/photos?&client_id=1QPPXDQSLOXUV5FGAANQG31S21EGUNNXJDP3HIXVECXWVXZ3&client_secret=IA0FKPF1FZ3AS4L1QNDQEFHC15B45ZY5ZXPDMX51UJL550TL&&v=20170724')
    //creating url of the photo using the api documentation from foursquare
    .done(function(data) {
      var photoUrl = data.response.photos.items[0].prefix + data.response.photos.items[0].width + 'x' + data.response.photos.items[0].height + data.response.photos.items[0].suffix;
      var infowindow = new google.maps.InfoWindow({
        content: '<p class="infowindow-render">A picture from inside</p> <p> <img src=' + photoUrl + ' alt="Pictures" width="100px"></p>'
      })
      //clear existing infowindows before showing the next one
      clearInfoWindow();
      infowindow.open(map, restaurant.marker);
      //put infowindow created in an array for reference to delete it after
      infowindowsArray.push(infowindow);
    })
    //implementing error handling
    .fail(function() { console.log("Sorry, we couldn't load the  images from Foursquare :(") })

}

//defining a infowindow array that i will use in order to delete the infowindows that i want to hide after a click
var infowindowsArray = [];

function clearInfoWindow() {
  for (var i = 0; i < infowindowsArray.length; i++) {
    infowindowsArray[i].close();
  }
  infowindowsArray.length = 0;
}

var viewModel = {
  //exporting a copy of the current array so that it is shown as a list on my landing page
  restaurants: ko.observableArray(restaurantModel.currentArray.slice(0, restaurantModel.currentArray.length)),

  query: ko.observable(''),

  search: function(restaurant) {
    //removing current restaurants at the beginning of the loop
    viewModel.restaurants.removeAll();
    clearInfoWindow();

    //check if value of restaurant exist in our model and adding/removing the marker depending on its existence
    for (var i = 0; i < restaurantModel.currentArray.length; i++) {
      if (restaurantModel.currentArray[i].name.toLowerCase().indexOf(restaurant.toLowerCase()) >= 0) {
        viewModel.restaurants.push(restaurantModel.currentArray[i]);
        //putting back the marker when there is a match
        restaurantModel.currentArray[i].marker.setMap(map)
      } else {
        //removing the marker when there is no match
        restaurantModel.currentArray[i].marker.setMap(null)
      }
    }
  },

  showInfoWindow: function(restaurant) {
    bounceMarker(restaurant.marker);
    showInfoWindow(restaurant)
  }
};

//create event notification mechanism. when the query changes, the search is invoked.
viewModel.query.subscribe(viewModel.search);

ko.applyBindings(viewModel);
