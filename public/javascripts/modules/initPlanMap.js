function initPlanMap(planMapDiv) {
  if (!planMapDiv) return;

  // const lat = parseFloat(planMapDiv.getAttribute("lat"));
  // const lng = parseFloat(planMapDiv.getAttribute("lng"));
  // console.log(lat, lng);
  //
  // const mapOptions = {
  //   center: { lat: -118.35, lng: 34.11 },
  //   zoom: 9
  // }
  //
  // const map = new google.maps.Map(planMapDiv, mapOptions);

  const lat = parseFloat(parseFloat(planMapDiv.getAttribute("lat")).toPrecision(5));
  const lng = parseFloat(parseFloat(planMapDiv.getAttribute("lng")).toPrecision(5));

  var myLatlng = new google.maps.LatLng(lat, lng);
  console.log(myLatlng);
  var mapOptions = {
    zoom: 4,
    center: myLatlng
  }
  var map = new google.maps.Map(planMapDiv, mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Hello World!"
  });

  // To add the marker to the map, call setMap();
  marker.setMap(map);
}

export default initPlanMap;
