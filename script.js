var infowindow;
var service;

var previousMarkers = [];
var marker;
var input;
var place;
var options;
var map;

function initMap() {
  // Intial map load
  var options = {
    lat: 32.715738,
    lng: -117.1610838,
  };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: options,
  });

  // Binding autocomplete to the map
  var input = document.getElementById("autocomplete");

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // Default marker position
  var marker = new google.maps.Marker({
    position: options,
    map: map,
    animation: google.maps.Animation.BOUNCE,
  });

  var infowindow = new google.maps.InfoWindow({
    content: "Your location!",
  });

  infowindow.open(map, marker);

  // Updates marker location when user inputs address
  autocomplete.addListener("place_changed", function () {
    marker.setVisible(false);
    place = autocomplete.getPlace();

    if (place) {
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      map.setZoom(13);
      var request = {
        location: place.geometry.location,
        radius: 8000,
        types: ["gas_station"],
      };

      var service = new google.maps.places.PlacesService(map);

      service.nearbySearch(request, callback);

      previousMarkers.push(marker);

      // if address input fails for whatever reason
    } else {
      map.setCenter(options);
      map.setZoom(13);
    }
  });
}

// Adds markers to display nearest gas stations on inputted address
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createrMarker(results[i]);
    }
  }
}

var icon = {
  url: "/images/gas-pump.png",
  scaledSize: new google.maps.Size(30, 30),
};

function createrMarker(place) {
  var placepos = place.geometry.location;
  var marker = new google.maps.Marker({
    id: 2,
    map: map,
    position: place.geometry.location,
    title: place.name,
    animation: google.maps.Animation.DROP,
    icon: icon,
  });

  // Zooms and centers when clicking on gas icon
  marker.addListener("click", () => {
    map.setZoom(20);
    map.setCenter(marker.position);
  });
}

console.log(previousMarkers);

google.maps.event.addDomListener(window, "load", initMap);
