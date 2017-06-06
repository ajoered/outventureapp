import axios from 'axios';

var defaultMapOptions =  {
  center: { lat: 34.01, lng: -118.42 },
  zoom: 8
};


function loadPlaces(map, lat = 34.01, lng = -118.42) {
  axios.get(`/api/plans/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      // create a bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();
      // create markers
      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position);
        const marker = new google.maps.Marker({ map, position });
        marker.place = place;
        return marker;
      });

      // when someone clicks on a marker, show the details of that place
      markers.forEach(marker => marker.addListener('click', function() {
        console.log(this.place);
        const html = `
          <div class="popup">
            <a href="/plan/${this.place.slug}">
              <p>${this.place.title} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

    });

}

function geocodeAddress(geocoder, resultsMap, address) {
  geocoder.geocode({'address': address.value}, function(results, status) {
    if (status === 'OK') {
      resultsMap.fitBounds(results[0].geometry.viewport);
      var newMapCenter = resultsMap.getCenter();
      loadPlaces(resultsMap, newMapCenter.lat(), newMapCenter.lng())
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function check_is_in_or_out(marker, map){
  return map.getBounds().contains(marker.getPosition());
}

function initMap(mapDiv) {
  if (!mapDiv) return; //If no map stop function

  if (navigator.geolocation) { //If geolocation center map on location
    navigator.geolocation.getCurrentPosition(function(position) {
      var mapOptions =  {
        center: { lat: position.coords.latitude, lng: position.coords.longitude },
        zoom: 8
      };
      input.placeholder = "Close to you..."
      const map = new google.maps.Map(mapDiv, mapOptions);
      loadPlaces(map, position.coords.latitude, position.coords.longitude)
    }, function() {
    });
  }

  const map = new google.maps.Map(mapDiv, defaultMapOptions); //Create and center map in LA by default
  loadPlaces(map)

  const input = document.querySelector('input[name="geolocate"]')
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => { //if place input changes...
    const place = autocomplete.getPlace();
    const newMapOptions = {
      center: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
      zoom: 8
    }
    var map = new google.maps.Map(mapDiv, newMapOptions); // Create and center map in new location
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, input)
  });

  google.maps.event.addListener(map, 'dragend', function() { alert('map dragged'); } );

}

export default initMap;
