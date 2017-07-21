import axios from 'axios';
var markers = [];
var map;
var tagArray = [];
var q = [];

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
  scaledSize: new google.maps.Size(40,40)
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
      loadPlaces(map, q)
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
    loadPlaces(map, q)
    reloadOnDragMap(map)
  });
}

function loadPlaces(map, q) {
  var lat = map.getCenter().lat()
  var lng = map.getCenter().lng()
  console.log(q);
  axios.get(`/api/plans/near?lat=${lat}&lng=${lng}${q.join()}`)
  .then(res => {
    const plans = res.data;
    console.log(plans);
    createMarkers(plans, map)
    createCards(plans)
    $('.fotorama').fotorama()
  });
}

function reloadOnDragMap(map) {
  google.maps.event.addListener(map, 'dragend', function functionName() {//loadplaces on map move
    loadPlaces(map, q)
  } );
}

window.updateTags = function (input) {
  if ( $(input).is(':checked') ) {
  tagArray.push(input.value)
} else {
  var searchTerm = input.value
  var index = tagArray.indexOf(searchTerm);    // Search for value and delete. Not supported in <IE9 :/
    if (index !== -1) {
        tagArray.splice(index, 1);
    }
}
}

window.updateQuery = function () {
  q = []

  var activityValues = $('#activities').val()
  if (activityValues != null) {
    var activityString = "&activities=" + activityValues.join(",")
    q.push(activityString)
  }

  var skillLevelValues = $('#skillLevel').val()
  if (skillLevelValues != null) {
    var skillLevelString = "&skillLevel=" + skillLevelValues.join(",")
    q.push(skillLevelString)
  }

  if (tagArray.length > 0) {
    var tagString = "&tags=" + tagArray.join(",")
    q.push(tagString)
  }

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
console.log(plan);
    const activityHtml = plan.activities.map(activity => {
      return `<div class="chip">
      <img src="/images/icons/${activity}.png">
      ${activity}
      </div>`
    }).slice(0, 2).join(" ")

    const tagHtml = plan.tags.map(tag => {
      return `<div class="chip">
      ${tag}
      </div>`
    }).slice(0, 4).join(" ")

    const heartStrings = plan.author.hearts.map(obj => obj.toString())
    const heartClass = heartStrings.includes(plan._id.toString()) ? 'primary-pink-text' : ''

    const donesStrings = plan.author.dones.map(obj => obj.toString())
    const doneClass = donesStrings.includes(plan._id.toString()) ? 'green-text' : ''
    const cardHtml = `
<div class="card medium z-depth-2">
  <div class="card-image waves-effect waves-block waves-light">
    <div data-width="100%" data-ratio="400/300" data-fit="cover" data-loop="true" data-swipe="true" data-trackpad="true" data-transition="slide" data-auto="false" class="fotorama" id="fotorama">
      <img src="/images/photos/camping.jpg"/>
      <img src="/images/photos/camp.jpg"/>
      <img src="/images/photos/scuba-Diving.jpg"/>
    </div>
  </div>
  <div class="card-content">
    <span class="card-title activator grey-text text-darken-4">${plan.title}<i class="material-icons right">control_point</i></span>
    <p class="text-300">${plan.tagline}</p>
  </div>
  <div class="card-reveal">
    <span class="card-title grey-text text-darken-4">${plan.title}<i class="material-icons right">close</i></span>
    <p>Activities</p>`  +  activityHtml + `
    <p>Tags</p> ` + tagHtml + `
    <p>Minimum Time</p>
    <div class="chip"> 4h </div>
    <p></p>
    <a class="btn waves-effect primary-blue waves-light center" href="/plans/${plan.slug}">Full Page<i class="fa fa-external-link left" aria-hidden='true'></i></a>
  </div>
  <a class="btn-floating share-fab waves-effect transparent waves-light"><i class="fa fa-share-square-o" aria-hidden="true"></i></a>
  <button class="btn-floating done-fab waves-effect waves-light transparent" value=${plan._id} onclick=donePlan(this) name="done">
    <i class="fa fa-check ${doneClass} ${'done' + plan._id}" aria-hidden="true"></i>
  </button>
  <button class="btn-floating saved-fab waves-effect waves-light transparent" value=${plan._id} onclick=heartPlan(this) name="heart">
    <i class="fa fa-heart ${heartClass} ${'heart' + plan._id}" aria-hidden="true"></i>
  </button>
  <a class="review-fab"><p class="text-300 grey-text text-lighten-2">★★★★</p></a>
  <a class="level-fab"><p class="text-300 grey-text">${plan.skillLevel}</p></a>
  <a class="saved-fab-symbol primary-pink-text"><i class="fa fa-heart" aria-hidden="true"></i></a>
  <a class="saved-fab-number grey-text text-lighten-2"><p class="text-300 grey-text text-lighten-2">4</p></a>
  <a class="done-fab-symbol green-text"><i class="fa fa-check" aria-hidden="true"></i></a>
  <a class="done-fab-number grey-text text-lighten-2"><p class="text-300 grey-text text-lighten-2">2</p></a>
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
