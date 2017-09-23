angular.module('cacApp', ['cacAppViews', 'ngRoute', 'ngAnimate'])
  .config(function($locationProvider, $routeProvider) {
      // console.log("cacapp")
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({
      redirectTo : '/'
    });
  });
