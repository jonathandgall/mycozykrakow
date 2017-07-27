//creating model on the global scope so it's accessible
var restaurantModel;

//retrieve in async the model
$.getJSON('./scripts/restaurant.json', function(data) {
    restaurantModel = data;
  })
  //init the application now that i know the view model is ready
  //inspired from this stackOverflow reply, to be sure to load correctly the map: https://stackoverflow.com/questions/28485293/how-to-handle-google-maps-api-with-out-internet-in-javascript/28487258
  .done(function() {
    init();
    $.getScript('https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCW39emCmlKM0E8h_gW5rQnQA-a0JdBTpc&callback=initMap')
      //showing error when the map address is incorrect
      .fail(function() {
        errorModel.errorMessage('the google map could not loaded');
        $('#myModal').modal({
          keyboard: true
        });
      });
  })
  //showing error when the restaurant access is incorrect
  .fail(function() {
    errorModel.errorMessage('the restaurants database');
    $('#myModal').modal({
      keyboard: true
    });
  });

//factorizing bounce in its own set
function bounceMarker(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
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

  //putting marker event listener to trigger bounce
  function waitClickMarker(marker) {
    marker.addListener('click', callBounce);
    //call the bounce for the correct marker
    function callBounce() {
      var correctRestaurant;
      for (let i = 0; i < restaurantModel.currentArray.length; i++) {
        if (restaurantModel.currentArray[i].marker == marker) {
          correctRestaurant = restaurantModel.currentArray[i];
        }
      }
      bounceMarker(marker);
      showInfoWindow(correctRestaurant);
    }
  }

  //implementing a loop in order to retrieve the markers from the model and show them in the view
  for (let i = 0; i < restaurantModel.currentArray.length; i++) {
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
  }
}

//showing infowindow with data from foursquare
function showInfoWindow(restaurant) {
  $.getJSON('https://api.foursquare.com/v2/venues/' + restaurant.f2venueid + '/photos?&client_id=1QPPXDQSLOXUV5FGAANQG31S21EGUNNXJDP3HIXVECXWVXZ3&client_secret=IA0FKPF1FZ3AS4L1QNDQEFHC15B45ZY5ZXPDMX51UJL550TL&&v=20170724')
    //creating url of the photo using the api documentation from foursquare
    .done(function(data) {
      var photoUrl = data.response.photos.items[0].prefix + data.response.photos.items[0].width + 'x' + data.response.photos.items[0].height + data.response.photos.items[0].suffix;
      var infowindow = new google.maps.InfoWindow({
        content: '<p class="infowindow-render">A picture from inside</p><p><img src="' + photoUrl + '" alt="Pictures" width="100px"></p>'
      });
      //clear existing infowindows before showing the next one
      clearInfoWindow();
      infowindow.open(map, restaurant.marker);
      //put infowindow created in an array for reference to delete it after
      infowindowsArray.push(infowindow);
    })
    //implementing error handling
    .fail(function() {
      errorModel.errorMessage('Foursquare');
      $('#myModal').modal({
        keyboard: true
      });
    });
}

//defining a infowindow array that i will use in order to delete the infowindows that i want to hide after a click
var infowindowsArray = [];

function clearInfoWindow() {
  for (let i = 0; i < infowindowsArray.length; i++) {
    infowindowsArray[i].close();
  }
  infowindowsArray.length = 0;
}



var errorModel = {
  errorMessage: ko.observable()
};
ko.applyBindings(errorModel, document.getElementById('myModal'));

//creating init app so we can be sure the viewmodel is accessing the model
function init() {
  var viewModel = {
    //exporting a copy of the current array so that it is shown as a list on my landing page
    restaurants: ko.observableArray(restaurantModel.currentArray.slice(0, restaurantModel.currentArray.length)),

    query: ko.observable(''),

    search: function(restaurant) {
      //removing current restaurants at the beginning of the loop
      viewModel.restaurants.removeAll();
      clearInfoWindow();

      //check if value of restaurant exist in our model and adding/removing the marker depending on its existence
      for (let i = 0; i < restaurantModel.currentArray.length; i++) {
        if (restaurantModel.currentArray[i].name.toLowerCase().indexOf(restaurant.toLowerCase()) >= 0) {
          viewModel.restaurants.push(restaurantModel.currentArray[i]);
          //putting back the marker when there is a match
          restaurantModel.currentArray[i].marker.setMap(map);
        } else {
          //removing the marker when there is no match
          restaurantModel.currentArray[i].marker.setMap(null);
        }
      }
    },

    showInfoWindow: function(restaurant) {
      bounceMarker(restaurant.marker);
      showInfoWindow(restaurant);
    }
  };

  //create event notification mechanism. when the query changes, the search is invoked.
  viewModel.query.subscribe(viewModel.search);

  ko.applyBindings(viewModel, document.getElementById('bindingScope'));
}
