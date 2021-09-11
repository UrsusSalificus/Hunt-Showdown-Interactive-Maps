///// GENERAL FOR LEAFLET /////
var mapImageLocation = 'images/bayou_map.png';
var map = L.map('bayouMap', {crs: L.CRS.Simple});
var bounds = [[0,0], [100,100]];
var image = L.imageOverlay(mapImageLocation, bounds).addTo(map);

// markers
var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hbHqrnYa4oMUquZcq8WkTJk0kI0t9scGBwro-EH-ALA/edit#gid=0';
var sol = L.latLng([ 5, 10]);
L.marker(sol).addTo(map)

/*
function addingMarkersToMap(allMarkers, map) {
  for (var i = 0; i < allMarkers.length; i++) {
    L.marker(allMarkers[i]).addTo(map);
  }
  return
}
*/

// Function to input in console when on the page to display
function addGridToPinpointMarker (){
  var allLeftPoints = Array.from({length: 99}, (_, i) => i + 1)
  var allRightPoints = allLeftPoints.reverse()

  // Horizontal lines
  for (var i = 0; i < allLeftPoints.length; i++) {
     L.polyline([[0, allLeftPoints[i]],[100, allRightPoints[i]]])
     .bindPopup("Right " + String(allLeftPoints[i]))
     .on('mouseover', function (e) {
       var popup = e.target.getPopup();
       popup.setLatLng(e.latlng).openOn(map);
      })
     .addTo(map);
  }
  // Vertical lines
  for (var i = 0; i < allLeftPoints.length; i++) {
     L.polyline([[allLeftPoints[i], 0],[allRightPoints[i], 100]])
     .bindPopup("Left " + String(allLeftPoints[i]))
     .on('mouseover', function (e) {
       var popup = e.target.getPopup();
       popup.setLatLng(e.latlng).openOn(map);
      })
     .addTo(map);
  }
}




map.fitBounds(bounds);
