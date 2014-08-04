angular.module('enthub', ['ionic', 'enthub.controllers' , 'enthub.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('hub', {
      url: "/hub",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'ApplicationController'
    })

    .state('hub.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeController',
          controller: 'HomeFunctionsController'
        }
      }
    })
  
      .state('hub.events', {
      url: "/events",
      views: {
        'menuContent' :{
          templateUrl: "templates/events.html",
            controller: 'EventsController'
        }
      }
    })

    .state('hub.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: 'SettingsController'
        }
      }
    })

    .state('hub.friends', {
      url: "/friends",
      views: {
        'menuContent' :{
          templateUrl: "templates/friends.html",
          controller: 'FriendsController'
        }
      }
    })
  
  
    .state('hub.music', {
      url: "/home/music",
      views: {
        'menuContent' :{
          templateUrl: "templates/interests/music.html",
        }
      }
    })

    .state('hub.entertainment', {
      url: "/home/entertainment",
      views: {
        'menuContent' :{
          templateUrl: "templates/interests/entertainment.html",
        }
      }
    })
  
    .state('hub.hotels', {
      url: "/home/hotels",
      views: {
        'menuContent' :{
          templateUrl: "templates/interests/hotels.html",
        }
      }
    })
  
    .state('hub.nightlife', {
      url: "/home/nightlife",
      views: {
        'menuContent' :{
          templateUrl: "templates/interests/nightlife.html",
        }
      }
    })
  
    .state('hub.restaurants', {
      url: "/home/restaurants",
      views: {
        'menuContent' :{
          templateUrl: "templates/interests/restaurants.html",
        }
      }
    })

    .state('hub.single', {
      url: "/friends/:friendId",
      views: {
        'menuContent' :{
          templateUrl: "templates/friend.html",
          controller: 'FriendsController'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/hub/home');
});

