    angular.module('cacAPILibrary', [])

    .constant('CAC_API_LIST_PREFIX', 'http://api.geonames.org/countryInfoJSON')
    .constant('CAC_API_SEARCH_PREFIX', 'http://api.geonames.org/searchJSON')
    .constant('CAC_API_NB_PREFIX', 'http://api.geonames.org/neighboursJSON')
    .constant('CAC_API_USER_NAME', 'manish237')
    .factory('myCache', function($cacheFactory) {
        return $cacheFactory('myData');
    })
    .factory('cacCtrlData', [function() {
        var capital = "";
        var geonameId = "";
        var population = "";
        var areaInSqKm = "";
        var countryName="";
        var countryCode="";
        return {
            set: function(entry) {
                // console.log(entry)
                capital = entry.capital;
                geonameId = entry.geonameId;
                population = entry.population;
                areaInSqKm = entry.areaInSqKm;
                countryName = entry.countryName;
                countryCode = entry.countryCode;
            },
            get: function() {
                return {
                    capital : capital,
                    geonameId : geonameId,
                    population : population,
                    areaInSqKm : areaInSqKm,
                    countryName : countryName,
                    countryCode : countryCode
                }
            }
        };
    }])
    .factory('cacListRequest', ['$http', '$q','myCache', 'CAC_API_LIST_PREFIX','CAC_API_USER_NAME', function($http, $q, myCache,CAC_API_LIST_PREFIX,CAC_API_USER_NAME){
    return function(){
        console.log("cacListRequest")
        // console.log(params)
        var reqParams = {"username": CAC_API_USER_NAME};

        var cacheData = myCache.get('myData');
        // console.log(cacheData)

        if(cacheData) {
          console.log("mycache hit")
          return $q.when(cacheData)
        }
        else {
          console.log("service hit")
          return $http({
              method: 'GET',
              url: CAC_API_LIST_PREFIX,
              params: reqParams,
              cache:myCache
          })
          .then(
              function (response) {
                  //console.log("success list")
                  // console.log(response.data.geonames)
                  myCache.put('myData', response.data.geonames);
                  // console.log(myCache.get('myData'))
                  return $q.when(response.data.geonames);
              },
              function (response) {
                  // alert('error');
                  console.log("fail")
                  return $q.when({});
          })
        }
    };
    }])
    .factory('cacGetCntryRequest', ['$http', '$q', 'CAC_API_LIST_PREFIX', 'CAC_API_USER_NAME', function($http, $q, CAC_API_LIST_PREFIX,CAC_API_USER_NAME){
        return function(inpItem,params){
            console.log("cacGetCntryRequest")
            // console.log(params)
            // console.log(inpItem)
            var reqParams = angular.extend({}, params, {
                "username": CAC_API_USER_NAME
            });
            console.log(reqParams)
            return $http({
                method: 'GET',
                url: CAC_API_LIST_PREFIX,
                params: reqParams
            })
                .then(
                    function (response) {
                        var retItem ={};
                        console.log("success list")
                        // console.log(response.data.geonames[0].areaInSqKm)
                        // console.log(response.data.geonames[0].capital)
                        // console.log(params)
                        angular.extend(retItem,inpItem,{areaInSqKm:response.data.geonames[0].areaInSqKm,capital:response.data.geonames[0].capital});
                        console.log(retItem)
                        return $q.when(retItem);
                    },
                    function (response) {
                        // alert('error');
                        console.log("fail")
                        return $q.when({});
                    })
        };
    }])
    .factory('cacSearchRequest', ['$http', '$q', 'CAC_API_SEARCH_PREFIX', 'CAC_API_USER_NAME', function($http, $q, CAC_API_SEARCH_PREFIX,CAC_API_USER_NAME){
      return function(params){
          console.log("cacSearchRequest")
          // console.log(params)
          var reqParams = angular.extend({}, params, {
                                                        "username": CAC_API_USER_NAME
                                                        });
          console.log(reqParams)
          return $http({
              method: 'GET',
              url: CAC_API_SEARCH_PREFIX,
              params: reqParams
          })
          .then(
              function (response) {
                  console.log("success list")
                  //console.log(response.data.geonames)
                  return $q.when(response.data.geonames);
              },
              function (response) {
                  // alert('error');
                  console.log("fail")
                  return $q.when({});
          })
      };
    }])
    .factory('cacNBRequest', ['$http', '$q', 'CAC_API_NB_PREFIX', 'CAC_API_USER_NAME','cacGetCntryRequest', function($http, $q, CAC_API_NB_PREFIX, CAC_API_USER_NAME,cacGetCntryRequest){
      return function(params){
          console.log("cacNBRequest")
          // console.log(params)
          var reqParams = angular.extend({}, params, {"username": CAC_API_USER_NAME});

          console.log(reqParams)
          return $http({
              method: 'GET',
              url: CAC_API_NB_PREFIX,
              params: reqParams
          })
          .then(
              function (response) {
                  console.log("success list")
                  //console.log(response.data.geonames)
                  var items = [];
                  var item={};
                  for(i=0;i<response.data.geonames.length;i++)
                  {
                      if(i>2)
                          break;
                      item = response.data.geonames[i];
                      items.push(item)
                  }
                  return $q.when(items);
              },
              function (response) {
                  // alert('error');
                  console.log("fail")
                  return $q.when({});
          })
          .then(function (data) {
              console.log("then data");
              var items = [];
              var item={};
              for(i=0;i<data.length;i++)
              {
                  item = data[i];
                  // console.log(item)

                  cacGetCntryRequest(item,{country:item.countryCode})
                  .then(function (res) {
                      // console.log("cacGetCntryRes")
                      items.push(res)
                  })

              }
              return $q.when(items);
          })
      };
    }])
