import axios from 'axios';

const defaultMapOptions =  {
  center: { lat: 34.01, lng: -118.42 },
  zoom: 9,
};

function normalIcon() {
  return {
    url: 'https://res.cloudinary.com/dx1s7kdgz/image/upload/v1496951051/light-bulb_4_ieu1m4.png'
  };
}

function highlightedIcon() {
  return {
    url: 'https://res.cloudinary.com/dx1s7kdgz/image/upload/v1496951051/light-bulb_5_qi11uj.png'
  };
}

var markers = [];

function initMap(mapDiv) {
  if (!mapDiv) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var mapOptions =  {
        center: { lat: position.coords.latitude, lng: position.coords.longitude },
        zoom: 9
      };
      input.placeholder = "Close to you..."
      const map = new google.maps.Map(mapDiv, mapOptions);
      loadPlaces(map, position.coords.latitude, position.coords.longitude)
    }, function() {
    });
  }

  const map = new google.maps.Map(mapDiv, defaultMapOptions); //Create and center map in LA by default
  loadPlaces(map);
  reloadOnDragMap(map, mapDiv);

  const input = document.querySelector('input[name="geolocate"]')
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => { //if place input changes...
    const place = autocomplete.getPlace();
    const newMapOptions = {
      center: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
      zoom: 9
    }
    const map = new google.maps.Map(mapDiv, newMapOptions); // Create and center map in new location
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
    reloadOnDragMap(map, mapDiv)
  });
}

function reloadOnDragMap(map, mapDiv) {
  google.maps.event.addListener(map, 'dragend', function functionName() {//loadplaces on map move
    loadPlaces(map, map.getCenter().lat(), map.getCenter().lng())
  } );
}


function loadPlaces(map, lat = 34.01, lng = -118.42, q) {
  axios.get(`/api/plans/near?lat=${lat}&lng=${lng}${q}`)
    .then(res => {
      const plans = res.data;
      createMarkers(plans, map)
      createCards(plans)
    });
}

function createMarkers(plans, map) {
  clearMarkers()
  const infoWindow = new google.maps.InfoWindow();
  plans.map(plan => {
    const [planLng, planLat] = plan.location.coordinates;
    const position = { lat: planLat, lng: planLng };
    addMarker(position, plan, map);
  });
  console.log(markers);
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

function addMarker(location, plan, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: normalIcon()
  });
  marker.plan = plan;
  marker.id = plan._id
  marker.addListener('mouseover', function() {
    lightUpCard(marker.id);
  });
  marker.addListener('mouseout', function() {
    lightUpCard(marker.id);
  });
  markers.push(marker);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function lightUpCard(markerId) {
  $('#' + markerId).toggleClass("lightUpCard")
}

function lightUpMarker() {
  var index = $('#cards-container .card').index(this);
  console.log($('#cards-container .card'));
  console.log(index);

  $('#cards-container .card').hover(
  // mouse in
  function () {
    // first we need to know which <div class="marker"></div> we hovered
    var index = $('#cards-container .card').index(this);
    markers[index].setIcon(highlightedIcon());
  },
  function () {
    // first we need to know which <div class="marker"></div> we hovered
    var index = $('#cards-container .card').index(this);
    markers[index].setIcon(normalIcon());
  }
);
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
    const skillLevelHtml = plan.skillLevel.map(skillLevel => {
      return `
      ${skillLevel}
    `
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
                     <p>${skillLevelHtml}</p>
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
    lightUpMarker()
  })
}



export default initMap;
