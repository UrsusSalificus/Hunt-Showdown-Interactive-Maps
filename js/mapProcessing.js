// LEAFLET MAP //
function mapInitilisation() {
  var map = L.map('mapDiv', {crs: L.CRS.Simple});
  var bounds = [[0,0], [100,100]];
  var image = L.imageOverlay(mapImageLocation, bounds).addTo(map);
  map.fitBounds(bounds)
  return map
}


// MARKERS //
// Get latLng coords, using value fetched from csv file
function getLatLng(markerLatlng) {
  var markerLat = Number(markerLatlng.split(';')[0])
  var markerLng = Number(markerLatlng.split(';')[1])
  // Adding the marker
  var coords = L.latLng([ markerLat, markerLng])
  return coords
}

// Icons //
// To assign a color based on a value (0 to 1) -> used for spawn
function getColor(value){
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

// This will assign the right icon to the marker, providing the icon type
// Note that iconsLocation is only used for poster markers
function assignIcon(markerType, iconInfo, iconsLocation, comparativeValue) {
  if (markerType == 'poster'){
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
    if (iconInfo === 'outside') {
      return outsideIcon
    } else if (iconInfo === 'inside') {
      return insideIcon
    } else return undergroundIcon
  } else if (markerType == 'spawn'){
    console.log(iconInfo)
    console.log(comparativeValue)
    var spawnValue = iconInfo
    var spawnColor = getColor(comparativeValue)
    var spawnHtmlStyle = `
      background-color: ${spawnColor};
      `
    var spawnIcon = new L.divIcon({className: 'spawnMarkers',
      html: `<span style="${spawnHtmlStyle}">${spawnValue}</span>`
    });
    return spawnIcon
  }
}

// Parsing csv
async function parsingCSV(fileInCSV) {
  // MAP MARKERS
  var fetchedFile = await fetch(fileInCSV);
  var text = await fetchedFile.text();
  var data = text.split(/\r?\n/)
  return data
}

// To add a marker on the map
function addingMarkerToMap(markerData, iconsLocation, screenshotsLocation, map) {
  // Variables needed to add a marker
  var markerType = markerData[0]
  var markerLatlng = markerData[1]
  var iconInfo = markerData[2]
  var screenshot = markerData[3]

  var icon = assignIcon(markerType, iconInfo, iconsLocation=iconsLocation)
  var coords = getLatLng(markerLatlng)

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

// To add spawns marker on the map
function addingSpawnsToMap(spawnData, highestValue, map) {
  // Variables needed to add a spawn marker
  var markerType = spawnData[0]
  var spawnLatlng = spawnData[1]
  var spawnValue = spawnData[2]

  // We need to feed assignIcon with a value from 0 to 1 -> use highestValue
  // to find percentage compared to highest
  var comparativeValue = Number(spawnValue)/highestValue

  // Not using iconsLocation here (this is definitely not the right way of doing this...)
  var icon = assignIcon(markerType, iconInfo=spawnValue, iconsLocation='', comparativeValue)
  var coords = getLatLng(spawnLatlng)

  L.marker(coords, {icon: icon})
    .addTo(map);
}

// Fetching the data for the markers, then add it to the map
async function fetchingAndAddingMarkers(markersFile, iconsLocation, screenshotsLocation, map) {
  // MAP MARKERS
  var markerData = parsingCSV(markersFile)

  // We will parse every line of the markers file, skipping first (headers)
  // and last entry (empty)
  for (var i = 1; i < (markersData.length -1); i++) {
    var markerData = markersData[i].split(',')
    addingMarkerToMap(markerData, iconsLocation, screenshotsLocation, map)
  }
}

// Fetching the data for the spawn locations, then add it to the map
async function fetchingAndAddingSpawns(spawnsFile, map) {
  // MAP MARKERS
  var spawnsData = parsingCSV(spawnsFile)

  // We first need to find what is the highest value
  var highestValue = 0
  for (var i = 1; i < (spawnsData.length -1); i++) {
    var spawnValue = Number(spawnsData[i].split(',')[2])
    if (spawnValue > highestValue) highestValue = spawnValue
  }

  // We will parse every line of the spawn file, skipping first (headers)
  // and last entry (empty)
  for (var i = 1; i < (spawnsData.length -1); i++) {
    var spawnData = spawnsData[i].split(',')
    addingSpawnsToMap(spawnData, highestValue, map)
  }
}
