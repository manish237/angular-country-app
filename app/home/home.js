viewsModule.config(['$routeProvider', function($routeProvider) {
    // console.log($routeProvider)
    $routeProvider.when("/", {
        templateUrl : "./home/home.html",
        controller : 'HomeCtrl'
    });
}]);

viewsModule.controller('HomeCtrl', ['$scope','$location', function($scope,$location) {
    console.log('HomeCtrl')
    $scope.go = function(path){
        $location.url(path);
    };

}]);
