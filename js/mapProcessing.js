// LEAFLET MAP //
function mapInitilisation() {
  var map = L.map('mapDiv', {crs: L.CRS.Simple});
  var bounds = [[0,0], [100,100]];
  var image = L.imageOverlay(mapImageLocation, bounds).addTo(map);
  map.fitBounds(bounds)
  return map
}


// MARKERS //
// Icons //
// This will assign the right icon to the marker, providing the icon type
function assignIcon(iconsLocation, iconType) {
  var outsideIcon = L.icon({
      iconUrl: iconsLocation + 'outside_poster.svg',
      iconSize:     [30, 36], // size of the icon
      iconAnchor:   [15, 18], // point of the icon which will correspond to marker's location -> need center = half of iconSize
      popupAnchor:  [-30, -36] // point from which the popup should open relative to the iconAnchor
  });

  var insideIcon = L.icon({
      iconUrl: iconsLocation + 'inside_poster.svg',
      iconSize:     [40, 50], // size of the icon
      iconAnchor:   [20, 25], // point of the icon which will correspond to marker's location -> need center = half of iconSize
      popupAnchor:  [-40, -50] // point from which the popup should open relative to the iconAnchor
  });

  var undergroundIcon = L.icon({
      iconUrl: iconsLocation + 'underground_poster.svg',
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

// To add a marker on the map
function addingMarkerToMap(markerData, iconsLocation, screenshotsLocation, map) {
  // Variables needed to add a marker
  var markerType = markerData[0]
  var markerLatlng = markerData[1]
  var iconType = markerData[2]
  var screenshot = markerData[3]

  var icon = assignIcon(iconsLocation, iconType)
  var markerLat = Number(markerLatlng.split(';')[0])
  var markerLng = Number(markerLatlng.split(';')[1])
  // Adding the marker
  var coords = L.latLng([ markerLat, markerLng])
  L.marker(coords, {icon: icon})
    .bindPopup("<img src=" + "'" + screenshotsLocation + screenshot + "'" + " class=popupImage>")
    .on('mouseover', function (e) {
       var popup = e.target.getPopup();
       popup.setLatLng(e.latlng).openOn(map);
     })
     .on('mouseout', function(){
       this.closePopup();
     })
    .addTo(map);
}


// Fetching the data for the markers, then add it to the map
async function main(markersFile, iconsLocation, screenshotsLocation, map) {
  var data;
  var response = await fetch(markersFile);
  var markersText = await response.text();
  var markersData = markersText.split(/\r?\n/)

  // We will parse every line of the markers file, skipping first (headers)
  // and last entry (empty)
  for (var i = 1; i < (markersData.length -1); i++) {
    var markerData = markersData[i].split(',')
    addingMarkerToMap(markerData, iconsLocation, screenshotsLocation, map)
  }
}
