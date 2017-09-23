viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries", {
        templateUrl : "./browse/browse.html",
        controller : 'BrowseCtrl'
    });
}]);

viewsModule.controller('BrowseCtrl', ['$scope','cacListRequest','cacCtrlData','$location', '$rootScope',function($scope,cacListRequest,cacCtrlData,$location,$rootScope) {

    console.log("BrowseCtrl")

    cacListRequest()
    .then(function (data) {
        console.log("cacListRequest")
        console.log(data)
        $scope.countries = data;
    })

    $scope.go=function(path){
        console.log(path)
        $location.url(path);
    }

    $scope.showDetails = function(countryCode,capital,geonameId,population,areaInSqKm,countryName)
    {
        console.log("browse - showDetails")

        cacCtrlData.set({
                    capital : capital,
                    geonameId : geonameId,
                    population : population,
                    areaInSqKm:areaInSqKm,
                    countryName:countryName,
                    countryCode:countryCode
                })

        $location.url("/countries/"+countryCode);
    }
}]);


