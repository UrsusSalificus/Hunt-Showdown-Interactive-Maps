// Test data
var markersData = ['type,leftCoord,rightCoord,icon,screenshot', 'poster,83.5,20,inside,alain_1.jpg', 'poster,81,15.2,inside,alain_2.jpg','poster,82.5,17.3,outside,alain_3.jpg', '']

// To debug
function addMarkerOnClick(map) {
  var popup = L.popup();

  function onMapClick(e) {
      popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
  }

  map.on('click', onMapClick);
}
