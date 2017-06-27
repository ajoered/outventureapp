import axios from 'axios';
var markers = [];
var map;
var q = "";

const defaultMapOptions =  {
  center: { lat: 34.01, lng: -118.42 },
  zoom: 9,
};
const normalIcon = {
  url: 'https://res.cloudinary.com/dx1s7kdgz/image/upload/c_scale,w_64/v1497124913/light-bulb_egba8l.svg',
  scaledSize: new google.maps.Size(24,24)
};
const highlightedIcon = {
  url: 'https://res.cloudinary.com/dx1s7kdgz/image/upload/c_scale,w_64/v1497124913/light-bulb_egba8l.svg',
  scaledSize: new google.maps.Size(36,36)
};

function initMap(mapDiv) {
  if (!mapDiv) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var mapOptions =  {
        center: { lat: position.coords.latitude, lng: position.coords.longitude },
        zoom: 9
      };
      input.placeholder = "Close to you..."
      map = new google.maps.Map(mapDiv, mapOptions);
      loadPlaces(map, q, position.coords.latitude, position.coords.longitude)
      reloadOnDragMap(map);
    }, function() {
    });
  }

  map = new google.maps.Map(mapDiv, defaultMapOptions); //Create and center map in LA by default
  loadPlaces(map, q);
  reloadOnDragMap(map);

  const input = document.querySelector('input[name="geolocate"]')
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => { //if place input changes...
    const place = autocomplete.getPlace();
    const newMapOptions = {
      center: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
      zoom: 9
    }
    map = new google.maps.Map(mapDiv, newMapOptions); // Create and center map in new location
    loadPlaces(map, q, place.geometry.location.lat(), place.geometry.location.lng())
    reloadOnDragMap(map)
  });
}

function reloadOnDragMap(map) {
  google.maps.event.addListener(map, 'dragend', function functionName() {//loadplaces on map move
    loadPlaces(map, q, map.getCenter().lat(), map.getCenter().lng())
  } );
}

function loadPlaces(map, q, lat = 34.01, lng = -118.42) {
  axios.get(`/api/plans/near?lat=${lat}&lng=${lng}&${q}`)
    .then(res => {
      const plans = res.data;
      createMarkers(plans, map)
      createCards(plans)
    });
}

window.updateQuery = function (input) {
  q = ""
  var activityString;
  const activityValue = $('#activities').val()
  if ((activityValue == null || activityValue.includes("All")) ? activityString = " " : activityString = "activities=" + activityValue.join(","))

  var skillLevelString;
  const skillLevelValue = $('#skillLevel').val()
  if ((skillLevelValue == null || skillLevelValue.includes("All")) ? skillLevelString = " " : skillLevelString = "skillLevel=" + skillLevelValue.join(","))

  q = activityString + "&" + skillLevelString
  q.replace(/\s+/g, ' ');
  loadPlaces(map, q)
  reloadOnDragMap(map);
}

function createMarkers(plans, map) {
  clearMarkers()
  const infoWindow = new google.maps.InfoWindow();
  plans.map(plan => {
    const [planLng, planLat] = plan.location.coordinates;
    const position = { lat: planLat, lng: planLng };
    addMarker(position, plan, map);
  });
  markers.forEach(marker => marker.addListener('click', function() {
    const html = `
                <div class="card medium">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="images/photos/${this.plan.activities[0]}.jpg">
                  </div>
                  <a class="btn-floating halfway-fab waves-effect waves-light primary-pink lighten-1"><i class="fa fa-heart" aria-hidden="true"></i></a>
                  <a class="btn-floating midway-fab waves-effect waves-light grey darken-1"><i class="fa fa-share" aria-hidden="true"></i></a>
                  <a href="/plans/${this.plan._id}/edit" class="btn-floating edit-fab waves-effect transparent waves-light"><i aria-hidden="true" class="fa fa-pencil"></i></a>
                  <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${this.plan.title}<i class="material-icons right">more_vert</i></span>
                    <p class="orange-text">★★★★★</p>
                    <a class="btn waves-effect teal lighten-3 waves-light" href="/plans/${this.plan.slug}">More</a>
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
    icon: normalIcon});
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
  $('#' + markerId).children().first().toggleClass("lightUpCard")
}

function lightUpMarker() {
  var index = $('#cards-container .card').index(this);

  $('#cards-container .card').hover(
  function () {
    var index = $('#cards-container .card').index(this);
    markers[index].setIcon(highlightedIcon);
  },
  function () {
    var index = $('#cards-container .card').index(this);
    markers[index].setIcon(normalIcon);
  }
)
}

function createCards(plans) {
  const cardsContainer = document.getElementById("cards-container")
  while (cardsContainer.firstChild) {
      cardsContainer.removeChild(cardsContainer.firstChild);
  }
  plans.forEach(plan => {
    const activityHtml = plan.activities.map(activity => {
      return `<div class="chip">
      <img src="https://cdn2.iconfinder.com/data/icons/sport-ii/79/08-512.png">
      ${activity}
      </div>`
    }).slice(0, 2).join(" ")
    const skillLevelHtml = plan.skillLevel.map(skillLevel => {
      return `
      ${skillLevel}
    `
  }).join(" / ")
    const cardHtml = `

<div class="card medium z-depth-2">
  <div class="card-image waves-effect waves-block waves-light">
    <img class="activator" src="images/photos/${plan.activities[0]}.jpg">
  </div>
    <div class="card-content">
      <span class="card-title activator grey-text text-darken-4">${plan.title}
        <i class="material-icons right">more_vert</i>
      </span>`+
      activityHtml +
      `
      <div class="div">`+
        skillLevelHtml +
      `</div>
    </div>

    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">${plan.title}
        <i class="material-icons right">close</i>
      </span>
      <p>${plan.description}</p>
      <a class="btn-floating waves-effect teal lighten-3 waves-light" href="${plan.slug}"></a>
    </div>

    <a class="btn-floating midway-fab waves-effect transparent waves-light">
      <i class="fa fa-share-square-o" aria-hidden="true"></i></a>
      <form class="heart" method="POST" action="/api/plans/${plan._id}/heart">
        <button class="btn-floating halfway-fab waves-effect waves-light transparent" type="submit" name="heart">
          <i class="fa fa-heart primary-pink-text" aria-hidden="true"></i>
        </button>
      </form>
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
