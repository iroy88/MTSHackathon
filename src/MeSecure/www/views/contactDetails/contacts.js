angular.module('App')
    .controller('ContactsController', ['$scope', '$http', '$ionicPlatform', '$cordovaGeolocation', '$ionicPopup', '$q','$localStorage', function ($scope, $http, $ionicPlatform, $cordovaGeolocation, $ionicPopup, $q,$localStorage) {
               
        $scope.Userdata={};  

$scope.Save=function() {
    getDestlatlon()   
  }

  function getDestlatlon()
  {
      geocoder = new google.maps.Geocoder();
    var address = document.getElementById("my-address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng() + '&sensor=true').success(
                        function (data) {
                            savedate(data.results[0].place_id)
                        }, function (err) {
                   alert('Location service not working !');
                });
      } 
      else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  function savedate(destinationplaceID)
  {
      $scope.Userdata.destinationplaceID=destinationplaceID
      $scope.Userdata.address=document.getElementById("my-address").value
      $localStorage.Userdata = $scope.Userdata;
      $ionicPopup.alert({
                                    title: 'SecureMe',
                                    template: 'Your emergency contact details has been saved.'
            }); 
  }
    }]);
