var arrayFridges = [];

$( document ).ready(function() {
    
});


// Set the configuration for your app Firebase
var config = {
    authDomain: 'fridgesaverconfig.firebaseio.com',
    databaseURL: 'https://fridgesaverconfig.firebaseio.com/',
    storageBucket: 'fridgesaverconfig.appspot.com'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


var starCountRef = firebase.database().ref();

// Read all database rows
starCountRef.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        arrayFridges.push({
            mac: childSnapshot.key.toString(),
            class: childSnapshot.val().class.toString(),
            fan: childSnapshot.val().fan,
            lat: childSnapshot.val().lat,
            lon: childSnapshot.val().lon,
            model: childSnapshot.val().model.toString(),
            name: childSnapshot.val().name.toString(),
            threshold: childSnapshot.val().threshold.toString(),
            time1: childSnapshot.val().time1.toString(),
            time2: childSnapshot.val().time2.toString()
        });
    });
    console.log("recoger datos");
    initMap();
});

/******** GOOGLE MAPS ************/

    function initMap() {
        
        // Location center
        var location = new google.maps.LatLng(40.416573, -3.703689);

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location,
            zoom: 6,
            panControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);

        var markerImage = 'img/icon-map.png';

        console.log('Antes array for each');

        // Loop throw fridges
        arrayFridges.forEach(function(element) {
            console.log(element);

            var location = new google.maps.LatLng(element.lat, element.lon);

            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: markerImage
            });

            var contentString = '<div class="info-window">' +
                    '<h3>Fridge ' + element.name + '</h3>' +
                    '<div class="info-content">' +
                    '<p><b>Model:</b> ' + element.model + '</p>' +
                    '<p><b>Class:</b> ' + element.class + '</p>' +
                    '<p>See the detailed information of this fridge</p>' +
                    '<a href="pages/index.html?mac=' + element.mac + '&nameFridge=' + element.name + '" type="button" class="btn btn-info">Info</a>' +
                    '</div>' +
                    '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 400
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });

    }