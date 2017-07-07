var tiempoRefresh = 10000;
var numberResults = 300;

var arrChartTemps = [];
var chartTemps;
var lastTempBack = -1;
var lastTempFront = -1;
var lastConsumption = -1;
var lastFan = -1;

chartTemps = Morris.Area({
        element: 'temps-chart',
        data: arrChartTemps,
        xkey: 'period',
        ykeys: ['tempFront','tempBack'],
        labels: ['Temp. Front', 'Temp. Back'],
        pointSize: 1,
        hideHover: 'auto',
        resize: true,
        lineColors: ['#d3bd47', '#2e7598']
    });  

// Set the configuration for your app
var config = {
    apiKey: 'AIzaSyCfHoColdJFpIRgyYis6Tl0UriLLtJ0swI',
    authDomain: 'fridgesaverdata.firebaseapp.com',
    databaseURL: 'https://fridgesaverdata.firebaseio.com',
    storageBucket: 'fridgesaverdata.appspot.com'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


var starCountRef = firebase.database().ref('A020A61AF950').limitToLast(720);
starCountRef.on('value', function(snapshot) {
    arrChartTemps = [];
    snapshot.forEach(function(childSnapshot) {
        arrChartTemps.push({
            period: childSnapshot.key,
            tempFront: childSnapshot.val().tempOut,
            tempBack: childSnapshot.val().tempInt
        });
    });

    actualizarGrafico();
});

function actualizarGrafico()
{
    chartTemps.setData(arrChartTemps);
}

function actualizarInformacion(snapshot)
{
    console.log(snapshot.length);
    /*
    arrChartTemps = [];

    for (i = 0; i < snapshot.length; i++) {
        var presionField = Math.round(data.feeds[i].field2);

        // Máxima 
        if(maxPresion == -1 || maxPresion < presionField)
        {
            maxPresion = presionField;
        }

        // Mínima 
        if(minPresion == -1 || minPresion > presionField)
        {
            minPresion =  presionField;
        }
        arrUv.push({
            period: data.feeds[i].created_at,
            uv: Math.round(data.feeds[i].field2)
        });
    }

    $('#presionActual').text(presion + "hPa");
    $('#presionMaxima').text(maxPresion + "hPa");
    $('#presionMinima').text(minPresion + "hPa");

    // Actualizamos gráfico
    actualizarGrafico();*/
}
