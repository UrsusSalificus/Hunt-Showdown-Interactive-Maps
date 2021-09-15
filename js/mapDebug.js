// Test data
var markerInline = 'poster,61.5;70.6,inside,arden_1.jpg'
var markerData = markerInline.split(',')
//addingMarkerToMap(markerData, iconsLocation, screenshotsLocation, map)

// To copy the latlng to clipboard
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

// To debug
function addMarkerOnClick(map) {
  var popup = L.popup();

  function onMapClick(e) {
    var latlng = e.latlng
    // Only 1 digit
    latlng['lat'] = Number(latlng['lat'].toFixed(1))
    latlng['lng'] = Number(latlng['lng'].toFixed(1))
    fallbackCopyTextToClipboard(String(latlng))
    popup
        .setLatLng(latlng)
        .setContent("You clicked the map at " + latlng.toString())
        .openOn(map);
  }

  map.on('click', onMapClick);
}
