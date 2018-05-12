let map;
let infowindow;

let request;
let service;
let markers = [];


function init() {
	let center = new google.maps.LatLng(39.2846225,-76.7605701);
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 12
	});

	request = {
		location: center,
		radius: 8047, //5miles
		types: ['cafe'] //the key to find
	};
	infowindow = new google.maps.InfoWindow(); //little window  for marker info

	let service = new google.maps.places.PlacesService(map); //search for whatever were looking for in our case cafes

	service.nearbySearch(request, callback);

	google.maps.event.addListener(map, 'rightclick', function(event){
		map.setCenter(event.latLng);
		clearResults(markers);

		request = {
			location: event.latLng,
			radius: 8047,
			types: ['cafe']
		};
		service.nearbySearch(request, callback);
	});

}

function callback(results, status) {
	if(status == google.maps.places.PlacesServiceStatus.OK){
		for (var i = 0; i < results.length; i++){
			markers.push(createMarker(results[i]));
		}
	}
}

function createMarker(place) {
	let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
	let placeLoc = place.geometry.location;
	let marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: iconBase + 'coffee.png'
	});

	google.maps.event.addListener(marker, 'click', function() { //click event on the marker displays info on the location.
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});

	return marker;
}

function clearResults(markers) { //clears out markers array and makes it fresh and new after every right-click
	for(var m in markers) {
		markers[m].setMap(null);
	}
	markers = [];
}


google.maps.event.addDomListener(window, 'load', init);