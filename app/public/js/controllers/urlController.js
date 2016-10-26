angular.module("tinyurlApp")
    .controller("urlController",["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $http.get("/api/v1/urls/" + $routeParams.shortUrl)
            .success(function (data) { /*$scope is normal var to read html，$http is var in ngResource*/
                $scope.shortUrl = data.shortUrl;
                $scope.longUrl = data.longUrl;
                $scope.showShortUrl = "http://v-z.me/"+data.shortUrl;
            })
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
            .success(function (data) {
                $scope.totalClicks = data;
            });
        /*apply multiple times for chart.js*/
        var renderChart = function (chart, infos) {
            $scope[chart + "Labels"] = [];
            $scope[chart + "Data"] = [];
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
                .success(function (data) {
                    console.log(data);
                    data.forEach(function (info) {
                        $scope[chart + "Labels"].push(info._id);
                        $scope[chart + "Data"].push(info.count);
                    });
                });
        };

        renderChart("doughnut","referer");
        renderChart("pie", "country");
        renderChart("base", "platform");
        renderChart("bar", "browser");

        $scope.hour = "hour";
        $scope.day = "day";
        $scope.month = "month";
        $scope.time = $scope.hour;  /*set hour to be default time unit*/

        $scope.getTime = function (time) {
            $scope.lineLabels = [];
            $scope.lineData = [];

            $scope.time = time;  /*click and see turning gray*/

            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
                .success(function (data) {
                    data.forEach(function (item){
                        var legend = "";
                        if(time === "hour"){
                            if(item._id.minutes < 10){
                                item._id.minutes = "0" + item._id.minutes;
                            }
                            legend = item._id.hour + ":" +item._id.minutes;
                        }
                        if(time === "day"){
                            legend = item._id.hour + ":00";
                        }
                        if(time === "month"){
                            legend = item._id.month + "/" + item._id.day;
                        }
                        $scope.lineLabels.push(legend);
                        $scope.lineData.push(item.count);
                    });
                });
        };
        $scope.getTime($scope.time);
    }]);
