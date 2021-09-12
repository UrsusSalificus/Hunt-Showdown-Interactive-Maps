// LOCATIONS //
var screenshotsLocation = "images/screenshots/"
var mapImageLocation = 'images/bayou_map.png';
var markersFile = "bayou_markers.csv"

// LEAFLET MAP //
var map = L.map('bayouMap', {crs: L.CRS.Simple});
var bounds = [[0,0], [100,100]];
var image = L.imageOverlay(mapImageLocation, bounds).addTo(map);

// MARKERS //
// Icons //
// This will assign the right icon to the marker, providing the icon type
function assignIcon(iconType) {
  var outsideIcon = L.icon({
      iconUrl: '../../icons/outside_poster.svg',
      iconSize:     [30, 36], // size of the icon
      iconAnchor:   [15, 18], // point of the icon which will correspond to marker's location -> need center = half of iconSize
      popupAnchor:  [-30, -36] // point from which the popup should open relative to the iconAnchor
  });

  var insideIcon = L.icon({
      iconUrl: '../../icons/inside_poster.svg',
      iconSize:     [40, 50], // size of the icon
      iconAnchor:   [20, 25], // point of the icon which will correspond to marker's location -> need center = half of iconSize
      popupAnchor:  [-40, -50] // point from which the popup should open relative to the iconAnchor
  });

  var undergroundIcon = L.icon({
      iconUrl: '../../icons/underground_poster.svg',
      iconSize:     [40, 50], // size of the icon
      iconAnchor:   [20, 25], // point of the icon which will correspond to marker's location -> need center = half of iconSize
      popupAnchor:  [-40, -50] // point from which the popup should open relative to the iconAnchor
  });
  if (iconType === 'outside') {
    return outsideIcon
  } else if (iconType === 'inside') {
    return insideIcon
  } else return undergroundIcon
}


// Importing marker file
// Test data
//var CSVData = ['type,leftCoord,rightCoord,icon,screenshot', 'poster,83.5,20,inside,alain_1.jpg', 'poster,81,15.2,inside,alain_2.jpg','poster,82.5,17.3,outside,alain_3.jpg', '']

// We will parse every line of the markers file, skipping first (headers)
// and last entry (empty)
function addingMarkersToMap(markersData, screenshotsLocation, map) {
  for (var i = 1; i < (markersData.length -1); i++) {
    var markerData = markersData[i].split(',')

    // Variables needed to add a marker
    var markerType = markerData[0]
    var leftCoord = markerData[1]
    var rightCoord = markerData[2]
    var iconType = markerData[3]
    var screenshot = markerData[4]

    var icon = assignIcon(iconType)
    // Adding the marker
    var coords = L.latLng([ leftCoord, rightCoord])
    L.marker(coords, {icon: icon})
      .bindPopup("<div class='popupContainer'><img src=" + "'" + screenshotsLocation + screenshot + "'" + " class=popupImage></div>")
      .on('mouseover', function (e) {
         var popup = e.target.getPopup();
         popup.setLatLng(e.latlng).openOn(map);
       })
       .on('mouseout', function(){
         this.closePopup();
       })
      .addTo(map);
  }
}

// Fetching the data for the markers, then add it to the map
async function main(markersFile, screenshotsLocation, map) {
  var data;
  var response = await fetch(markersFile);
  var markersText = await response.text();
  var markersData = markersText.split(/\r?\n/)
  addingMarkersToMap(markersData, screenshotsLocation, map)
}

main(markersFile, screenshotsLocation, map);

// Launching map
map.fitBounds(bounds);


// NOT USED : to add grid to map (used to pinpoint marker location)
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
      .on('mouseout', function(){
        this.closePopup();
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
      .on('mouseout', function(){
        this.closePopup();
      })
     .addTo(map);
  }
}
