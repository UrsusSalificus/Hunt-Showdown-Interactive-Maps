///// GENERAL FOR LEAFLET /////
var mapImageLocation = 'images/bayou_map.png';
var map = L.map('bayouMap', {crs: L.CRS.Simple});
var bounds = [[0,0], [100,100]];
var image = L.imageOverlay(mapImageLocation, bounds).addTo(map);

// markers
// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function startSeriesRetrieval(file) {
  // sent a GET request to retrieve the CSV file contents
  $.get(file, function( CSVdata) {
     // CSVdata is populated with the file contents
     // ready to be converted into an Array
      data = $.csv.toArray(CSVdata);
      console.log(data)
  });
};

console.log(startSeriesRetrieval("bayou_markers.csv"))

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
