angular.module('enthub.controllers', [])

.controller('ApplicationController', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('FriendsController', function($scope) {
    $scope.friends = [
        { title: 'Christina', id: 1 },
        { title: 'Kevin', id: 2 },
        { title: 'Thaddeus', id: 3 },
        { title: 'Dillon', id: 4 },
        { title: 'Chris', id: 5 }
    ];
    
      $scope.getFriendsAmount = function() {
          return $scope.friends.length;
        }
      
      $scope.addFriend = function () {
          $scope.friends.push({text:$scope.formFriendText, done:false});
          $scope.formFriendText = '';
      }
      
      $scope.removeFriend = function () {
        $scope.friends = _.filter($scope.friends, function(friend){
            return !friend.done;
        });
    };
})
 

.controller('HomeController', function($scope, $ionicModal, $ionicPopup, LoginAttempts, Users, TestData) {
// Create the login modal that we will use later
    var currentComputerIP = LoginAttempts.loadCurrentUserIPAndCreateAttempt();

        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            animation: 'slide-up'
        }).then(function(modal) {
           
            $scope.modal = modal;
            if (window.localStorage['current_user']) {
                //placeholder for alerts if needed in future
            } else {
                $scope.modal.show();
            }
        });
        $scope.submissionAllowed = function() {
          return LoginAttempts.isInTimeout();
        }
        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            if ($scope.loginData.username == "") {
                alert('The username cannot be blank');
                return;
            } else if ($scope.loginData.username == undefined) {
                alert('The username cannot be blank');
                return;
            } else if ($scope.loginData.password == "") {
                alert('The password cannot be blank');
                return;
            } else if ($scope.loginData.password == undefined) {
                alert('The password cannot be blank');
                return;
            }
            console.log('Doing login', $scope.loginData);

            if(LoginAttempts.isInTimeout())
            {
              console.log("not in timeout atm");
                if (Users.get($scope.loginData.username) == undefined) { 
                  console.log("user does not exist");

                  if(LoginAttempts.getAttemptCount(currentComputerIP) <= 3)
                  {
                      LoginAttempts.addLoginAttempt(currentComputerIP);
                      console.log("added a login attempt");
                  }
                  else{
                      LoginAttempts.loginTimeout(currentComputerIP);
                      console.log("initiated a timeout" + LoginAttempts.getAttemptCount(currentComputerIP));
                  }
                    $ionicPopup.alert({
                        title: 'Loggin In Error',
                        template: 'Username/Password is not correct'
                    });
                    
                } else {
                    //User exists
                    console.log("user does exist");

                    LoginAttempts.resetAttemptCount(currentComputerIP);

                    window.localStorage['current_user'] = $scope.loginData.username;
                    $scope.modal.remove();
                }
            }
            else{
              //user is in timeout currently
              console.log("user is in timeout");
            }

        };

  //$scope.home = TestData.all();
})

    .controller('HomeFunctionsController', [ '$scope', '$state', function($scope, $state) {
        
        $scope.musicClicked = function() {
            $state.go('hub.music');
        }
        
        $scope.restaurantsClicked = function() {
            $state.go('hub.restaurants');
        }
        
        $scope.entertainmentClicked = function() {
            $state.go('hub.entertainment');
        }
        
        $scope.hotelsClicked = function() {
            $state.go('hub.hotels');
        }
        
        $scope.nightlifeClicked = function() {
            $state.go('hub.nightlife');
        }
    }])
      
.controller('EventsController', function() {
    
// tried to test out how http://codepen.io/loicplaire/pen/Jugjq works
// was unable to implement  (connectivity??)
    
// This example uses the autocomplete feature of the Google Places API.
// It allows the user to find all hotels in a given place, within a given
// country. It then displays markers for all the hotels returned,
// with on-click details for each hotel.

/*var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = { 'country': 'us' };
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
  'au': {
    center: new google.maps.LatLng(-25.3, 133.8),
    zoom: 4
  },
  'br': {
    center: new google.maps.LatLng(-14.2, -51.9),
    zoom: 3
  },
  'ca': {
    center: new google.maps.LatLng(62, -110.0),
    zoom: 3
  },
  'fr': {
    center: new google.maps.LatLng(46.2, 2.2),
    zoom: 5
  },
  'de': {
    center: new google.maps.LatLng(51.2, 10.4),
    zoom: 5
  },
  'mx': {
    center: new google.maps.LatLng(23.6, -102.5),
    zoom: 4
  },
  'nz': {
    center: new google.maps.LatLng(-40.9, 174.9),
    zoom: 5
  },
  'it': {
    center: new google.maps.LatLng(41.9, 12.6),
    zoom: 5
  },
  'za': {
    center: new google.maps.LatLng(-30.6, 22.9),
    zoom: 5
  },
  'es': {
    center: new google.maps.LatLng(40.5, -3.7),
    zoom: 5
  },
  'pt': {
    center: new google.maps.LatLng(39.4, -8.2),
    zoom: 6
  },
  'us': {
    center: new google.maps.LatLng(37.1, -95.7),
    zoom: 3
  },
  'uk': {
    center: new google.maps.LatLng(54.8, -4.6),
    zoom: 5
  }
};

function initialize() {
  var myOptions = {
    zoom: countries['us'].zoom,
    center: countries['us'].center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

  infoWindow = new google.maps.InfoWindow({
      content: document.getElementById('info-content')
      });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });
  places = new google.maps.places.PlacesService(map);

  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
  google.maps.event.addDomListener(document.getElementById('country'), 'change',
      setAutocompleteCountry);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }

}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['lodging']
  };

  places.search(search, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// The START and END in square brackets define a snippet for our documentation:
// [START region_setcountry]
// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  var country = document.getElementById('country').value;
  if (country == 'all') {
    autocomplete.setComponentRestrictions([]);
    map.setCenter(new google.maps.LatLng(15, 0));
    map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({ 'country': country });
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }
  clearResults();
  clearMarkers();
}
// [END region_setcountry]

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 == 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({reference: marker.placeResult.reference},
      function(place, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website == null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}
initialize();
*/
    
    
    
    
})
      
.controller('SettingsController',function($scope, $ionicPopup, $timeout) {

 // Triggered on a button click, or some other target
 /*$scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="password" ng-model="data.wifi">',
     title: 'Enter Wi-Fi Password',
     subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.wifi) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };*/

   // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Location Change',
       template: 'Do you want to change your location?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('Continue');
       } else {
         console.log('Cancel');
       }
     });
   };

   // An alert dialog
   /*$scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Do you want to change your location?',
       template: 'Continue.'
     });
     alertPopup.then(function(res) {
       console.log('Navigating to location change.');
     });
   };*/
})