angular.module("tinyurlApp")
    .controller("homeController",["$scope","$http","$location", function ($scope, $http, $location) {
        $scope.submit = function () {                             /*  $location是由ngRouter提供的变量  */
            $http.post("/api/v1/urls", {
                longUrl : $scope.longUrl
            }).success(function (data) { /* find out the long url of short url*/
                $location.path("/urls/" + data.shortUrl);
            });
        }
    }]);
