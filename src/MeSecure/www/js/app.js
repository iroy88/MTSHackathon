angular.module('App', ['ionic','ngCordova','ngStorage'])

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home/home.html',
      controller: 'HomeController'
    })
    .state('contacts', {
      url: '/contacts',
      templateUrl: 'views/contactDetails/contacts.html',
      controller: 'ContactsController'
    });
  $urlRouterProvider.otherwise('/home');

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
})

