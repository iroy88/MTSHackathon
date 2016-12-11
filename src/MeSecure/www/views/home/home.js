angular.module('App')
    .controller('HomeController', ['$scope', '$http', '$ionicPlatform', '$cordovaGeolocation', '$ionicPopup', '$q','$localStorage', function ($scope, $http, $ionicPlatform, $cordovaGeolocation, $ionicPopup, $q,$localStorage) {
   
    $scope.Userdata={};
    $scope.originplaceID=null
    $scope.distance=null
    $scope.duration=null
    $scope.currentloc=null

$scope.Starttracking=function()
{
  $scope.Userdata=$localStorage.Userdata ;
  estimatedTime($scope.originplaceID,$scope.Userdata.destinationplaceID)
}


function estimatedTime(originplaceID,destinationplaceID){
$http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:'+originplaceID+'&destinations=place_id:'+destinationplaceID+'&key=AIzaSyCyVTN6PJNsb8o1vGeXYfElFLF7h4TQaz8').success(
                        function (data) {
                            console.log('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:'+originplaceID+'&destinations=place_id:'+destinationplaceID+'&key=AIzaSyCyVTN6PJNsb8o1vGeXYfElFLF7h4TQaz8')
                            calculationLogic(data.rows[0].elements[0].distance.text,data.rows[0].elements[0].duration.text)
                        }, function (err) {
                    alert('Location service not working !');
                        });
}
  $scope.checkLocation = function () {
         var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.lat = position.coords.latitude
                    $scope.lon = position.coords.longitude
                    $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.lat + ',' + $scope.lon + '&sensor=true').success(
                        function (data) {
                            $scope.originplaceID=data.results[0].place_id
                            $scope.currentloc=data.results[0].formatted_address
                        })
                }, function (err) {
                   alert('Location service not working !');
                });
        }

        function calculationLogic(distance,duration)
        {
            var confirmPopup =$ionicPopup.confirm({
                                    title: 'SecureMe',
                                    template: 'Distance from your your current location to Home Location is:' + '<b>' +distance + '</b></br>' +
                                        'Estimated Duration is :<b>' + duration
            }); 
            confirmPopup.then(function (res) {
                                            if (res) {
                                        var delay=5000
                                        setTimeout(function() {
                                            repeatcheckLocation()
                                        }, delay);
                                            } else {
                                                alert('Tracking Stopped');
                                            }
                            });
        }

        function repeatcheckLocation()
        {
         var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.lat = position.coords.latitude
                    $scope.lon = position.coords.longitude
                    $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.lat + ',' + $scope.lon + '&sensor=true').success(
                        function (data) {                            
                            $scope.Userdata=$localStorage.Userdata ;
                           repeatestimatedTime(data.results[0].place_id,$scope.Userdata.destinationplaceID)
                        })
                }, function (err) {
                   alert('Location service not working !');
                });
        }

        function repeatestimatedTime(originplaceID,destinationplaceID){
          $http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:'+originplaceID+'&destinations=place_id:'+destinationplaceID+'&key=AIzaSyCyVTN6PJNsb8o1vGeXYfElFLF7h4TQaz8').success(
                        function (data) {
                            console.log('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:'+originplaceID+'&destinations=place_id:'+destinationplaceID+'&key=AIzaSyCyVTN6PJNsb8o1vGeXYfElFLF7h4TQaz8')
                             //alert(data.rows[0].elements[0].distance.value)
                             var distance=parseInt(data.rows[0].elements[0].distance.value)
                             if(distance>parseInt(500))
                             {
                              sendSms()
                             }
                        }, function (err) {
                    alert('Location service not working !');
                        });
        }

        function sendSms() {
        $scope.Userdata=$localStorage.Userdata ;
        var pc=$scope.Userdata.parentContact
        var mc=$scope.Userdata.managerContact
        var name=$scope.Userdata.username
        var msgtext=name+' have not reached home safely yet'+' '+ 'His/Her emergency contact number is:'+pc
        $http.get('http://localhost:1482/api/values?to='+mc+'&from=13477565536&message='+msgtext).success(
                        function (data) {
                           console.log('http://100.124.19.124:1482/api/values?to='+mc+'&from=13477565536&message=Test') 
                          $ionicPopup.alert({
                                    title: 'SecureMe',
                                    template: 'Message Sent !'
                           });
                        }, function (err) {
                    alert('Location service not working !');
                        });
     }
 }]);