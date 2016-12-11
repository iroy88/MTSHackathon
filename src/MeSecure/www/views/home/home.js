angular.module('App')
    .controller('HomeController', ['$scope', '$http', '$ionicPlatform', '$cordovaGeolocation', '$ionicPopup', '$q','$cordovaSms', function ($scope, $http, $ionicPlatform, $cordovaGeolocation, $ionicPopup, $q,$cordovaSms) {
        var localdb = new PouchDB("MeSecureDB");
        $scope.lat=null
        $scope.lon=null
        $scope.originplaceID=null
        $scope.destinationplaceID=null
        $scope.test = function () {
          $scope.locationChanged = function (location) {
              alert()
         alert(location);
         };
            var contact = checkData();
            contact.then(function (res) {
                if (res && res.length) {

                }
                else {
                }
            })

            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.lat = position.coords.latitude
                    $scope.lon = position.coords.longitude
                    alert($scope.lat+' '+$scope.lon)
                    $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.lat + ',' + $scope.lon + '&sensor=true').success(
                        function (data) {
                            $scope.originplaceID=data.results[0].place_id 
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'MeSecure',
                                template: 'You are currently at <br>' + '<b>' + data.results[0].formatted_address + '</b></br>' +
                                 '<b>' + data.results[0].place_id + '</b></br>'+                              
                                '</br></br>Start tracking?'
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                    estimatedTime();
                                    sendSms();
                                } else {
                                    alert('Tracking Stopped');
                                }
                            });
                        })

                }, function (err) {
                   alert('Location service not working !');
                });



        }

function estimatedTime(){
    console.log($scope.lat+' '+$scope.lon)
    var destplaceID='ElYxMDcsIEFuYW5kYXB1ciBNYWluIFJkLCBTZWN0b3IgSSwgRWFzdCBLb2xrYXRhIFR3cCwgS29sa2F0YSwgV2VzdCBCZW5nYWwgNzAwMTA3LCBJbmRpYQ'
$http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:'+$scope.originplaceID+'&destinations=place_id:'+destplaceID+'&key=AIzaSyCyVTN6PJNsb8o1vGeXYfElFLF7h4TQaz8').success(
                        function (data) {
                            $ionicPopup.confirm({
                                title: 'MeSecure',
                                template: 'Distance from your your current location to Home Location is:' + '<b>' + data.rows[0].elements[0].distance.text + '</b></br>' +
                                 'Estimated Duration is :<b>' + data.rows[0].elements[0].duration.text
                            });
                        }, function (err) {
                    alert('Location service not working !');
                        });
}

  function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });
        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
         var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

         var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
           if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
        });
        autocomplete.setTypes('address');
  }

function sendSms() {
    alert('Inside SEND SMS');
  }
  
        function checkData() {
            var deferred = $q.defer()
            var rows = []
            localdb.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                if (err) {
                    deferred.reject(err)
                }
                else {

                    for (var i in doc.rows) {
                        rows.push(doc.rows[i].doc)
                        //alert(JSON.stringify(doc.rows[i].doc))
                    }
                    deferred.resolve(rows)
                }

            })
            return deferred.promise
        }
    }]);
