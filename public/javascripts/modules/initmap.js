import axios from 'axios';

const defaultMapOptions =  {
  center: { lat: 34.01, lng: -118.42 },
  zoom: 8
};

function initMap(mapDiv) {
  if (!mapDiv) return;

  if (navigator.geolocation) {
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
  loadPlaces(map);

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

  google.maps.event.addListener(map, 'dragend', function functionName() {//loadplaces on map move
    loadPlaces(map, map.getCenter().lat(), map.getCenter().lng())
  } );

}

function loadPlaces(map, lat = 34.01, lng = -118.42) {
  axios.get(`/api/plans/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const plans = res.data;
      createMarkers(plans, map)
      createCards(plans)
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

function createMarkers(plans, map) {
  const bounds = new google.maps.LatLngBounds();
  const infoWindow = new google.maps.InfoWindow();

  const markers = plans.map(plan => {
    const [planLng, planLat] = plan.location.coordinates;
    const position = { lat: planLat, lng: planLng };
    bounds.extend(position);
    const marker = new google.maps.Marker({ map, position });
    marker.plan = plan;
    marker.id = plan._id
    console.log(marker.id);
    marker.addListener('mouseover', function() {
      lightUpCard(marker.id);
    });
    marker.addListener('mouseout', function() {
      lightUpCard(marker.id);
    });
    return marker;
  });
  // markers.forEach(marker => {
  //   const planIdArray = plans.map(plan => {
  //         return plan._id})
  //   if (planIdArray.includes(marker.plan._id)) {
  //     marker.setMap(null)
  //   }
  // })
  //loop marker array and if marker id does not equal plan id   // marker.setMap(null)

  markers.forEach(marker => marker.addListener('click', function() {
    const html = `
                <div class="card medium">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="uploads/${this.plan.photo || 'canoeing.jpg'}">
                  </div>
                  <a class="btn-floating halfway-fab waves-effect waves-light primary-pink lighten-1"><i class="fa fa-heart" aria-hidden="true"></i></a>
                  <a class="btn-floating midway-fab waves-effect waves-light grey darken-1"><i class="fa fa-share" aria-hidden="true"></i></a>
                  <a href="/plans/${this.plan._id}/edit" class="btn-floating edit-fab waves-effect transparent waves-light"><i aria-hidden="true" class="fa fa-pencil"></i></a>
                  <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${this.plan.title}<i class="material-icons right">more_vert</i></span>
                    <p>${this.plan.description}</p>
                    <p class="orange-text">★★★★★</p>
                  </div>
                  <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${this.plan.title}<i class="material-icons right">close</i></span>
                    <p>${this.plan.description}</p>
                  </div>
                </div>`;
    infoWindow.setContent(html);
    infoWindow.open(map, this);
  }));
}

function lightUpCard(markerId) {
  $('#' + markerId).toggleClass("lightUpCard")
}



function createCards(plans) {
  const cardsContainer = document.getElementById("cards-container")
  while (cardsContainer.firstChild) {
      cardsContainer.removeChild(cardsContainer.firstChild);
  }
  plans.forEach(plan => {
    const activityHtml = plan.activities.map(activity => {
      return `<div class="chip">
      ${activity}
      </div>`
    }).join()
    const cardHtml = `
                <div class="card medium">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="uploads/${plan.photo || 'canoeing.jpg'}">
                  </div>
                  <a class="btn-floating halfway-fab waves-effect waves-light primary-pink lighten-1"><i class="fa fa-heart" aria-hidden="true"></i></a>
                  <a class="btn-floating midway-fab waves-effect waves-light grey darken-1"><i class="fa fa-share" aria-hidden="true"></i></a>
                  <a href="/plans/${plan._id}/edit" class="btn-floating edit-fab waves-effect transparent waves-light"><i aria-hidden="true" class="fa fa-pencil"></i></a>
                  <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${plan.title}<i class="material-icons right">more_vert</i></span>` + activityHtml +

                    `<p>${plan.description}</p>
                    <p class="orange-text">★★★★★</p>
                  </div>
                  <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${plan.title}<i class="material-icons right">close</i></span>
                    <p>${plan.description}</p>
                  </div>
                </div>`
    const cardDiv = document.createElement('div');
    cardDiv.className = "col m6 s12"
    cardDiv.setAttribute("id", plan._id);
    cardDiv.innerHTML = cardHtml;
    cardsContainer.appendChild(cardDiv);
  })
}




export default initMap;
