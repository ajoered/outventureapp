function autocompleteCity(input, latInput, lngInput) {

  if(!input) return; // skip this fn from running if there is not input on the page

  var options = {
    types: ['(cities)']
  };

  const dropdown = new google.maps.places.Autocomplete(input, options);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // if someone hits enter on the address field, don't submit the form
  input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

export default autocompleteCity;
