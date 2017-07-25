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

  const lat = parseFloat(planMapDiv.getAttribute("lat"));
  const lng = parseFloat(planMapDiv.getAttribute("lng"));
  console.log(lat);
  var myLatlng = new google.maps.LatLng(lng, lat);
  console.log(myLatlng);

  var mapOptions = {
    zoom: 12,
    center: myLatlng
  }
  var map = new google.maps.Map(planMapDiv, mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Hello World!"
  });

  marker.setMap(map);
}

export default initPlanMap;
