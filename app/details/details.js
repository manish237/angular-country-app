viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries/:code", {
        templateUrl : "./details/details.html",
        controller : 'DetailsCtrl'
    });
}]);

viewsModule.controller('DetailsCtrl', ['$scope','$rootScope','$routeParams','cacSearchRequest','cacNBRequest','cacCtrlData','$location', function($scope,$rootScope,$routeParams,cacSearchRequest,cacNBRequest,cacCtrlData,$location) {
    console.log("DetailsCtrl")
    // console.log($routeParams.code)
    // console.log(cacCtrlData.get())
    var dataStore = cacCtrlData.get();
    var detRequest = {
        name_equals:dataStore.capital,
        country:dataStore.code,
        featureCode:"PPLC"
    }
    var nbRequest = {
        geonameId:dataStore.geonameId
    }

    cacSearchRequest(detRequest)
        .then(function(data)
    {
        console.log("cacSearchRequest resp")
        console.log(data[0]);
        $scope.capPopulation=data[0].population;
    })

    cacNBRequest(nbRequest)
        .then(function (data) {
            console.log("cacNBRequest resp")
            console.log(data)
            // console.log(data.length)
            $scope.countries = data;
        })


    $scope.areaInSqKm=dataStore.areaInSqKm;
    $scope.capital = dataStore.capital;
    $scope.population = dataStore.population;
    $scope.countryName = dataStore.countryName;
    $scope.countryName = dataStore.countryName;
    $scope.countryCode = dataStore.countryCode;
    $scope.smallCode = dataStore.countryCode.toLowerCase();

    $scope.go=function(path){
        // console.log(path)
        $location.url(path);
    }

    $scope.showDetails = function(countryCode,capital,geonameId,population,areaInSqKm,countryName)
    {
        console.log("details - showDetails")

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
