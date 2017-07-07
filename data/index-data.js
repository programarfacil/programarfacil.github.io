var tiempoRefresh = 10000;
var numberResults = 300;

var arrChartTemps = [];
var arrChartConsumption = [];
var arrChartFan = [];
var arrChartTempsInto = [];
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
        pointSize: 0,
        hideHover: 'auto',
        resize: true,
        ymax: 45,
        ymin: 15,
        lineColors: ['#8A6D3B', '#31708F']
    });

chartConsumptions = Morris.Area({
        element: 'consumption-chart',
        data: arrChartConsumption,
        xkey: 'period',
        ykeys: ['consumption'],
        labels: ['Consumption kWh'],
        pointSize: 0,
        hideHover: 'auto',
        resize: true,
        lineColors: ['#A94442']
});

chartFan = Morris.Area({
        element: 'fan-chart',
        data: arrChartFan,
        xkey: 'period',
        ykeys: ['fan'],
        labels: ['Fan'],
        pointSize: 0,
        hideHover: 'auto',
        resize: true,
        lineColors: ['#3C763D']
});

chartTempsInto = Morris.Area({
        element: 'tempsint-chart',
        data: arrChartTempsInto,
        xkey: 'period',
        ykeys: ['tempFri','tempFre'],
        labels: ['Temp. Fridge', 'Temp. Freeze'],
        pointSize: 0,
        hideHover: 'auto',
        resize: true,
        lineColors: ['#8A6D3B', '#31708F']
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
    arrChartConsumption = [];
    arrChartFan = [];
    arrChartTempsInto = [];
    snapshot.forEach(function(childSnapshot) {
        arrChartTemps.push({
            period: childSnapshot.key,
            tempFront: childSnapshot.val().tempOut,
            tempBack: childSnapshot.val().tempInt - childSnapshot.val().tempOut
        });
        arrChartConsumption.push({
            period: childSnapshot.key,
            consumption: childSnapshot.val().consumption
        });
        arrChartFan.push({
            period: childSnapshot.key,
            fan: childSnapshot.val().timeFan
        });
        arrChartTempsInto.push({
            period: childSnapshot.key,
            tempFri: childSnapshot.val().tempFre,
            tempFre: childSnapshot.val().tempFri - childSnapshot.val().tempFre
        });

        lastTempFront = childSnapshot.val().tempOut;
        lastTempBack = childSnapshot.val().tempInt;
        lastConsumption = childSnapshot.val().consumption;
        lastFan = childSnapshot.val().timeFan;
    });

    updateChartTemps();
    updateChartConsumption();
    updateLastMesurements();
    updateChartFan();
    updateChartTempsInt();
});

function updateChartTemps()
{
    chartTemps.setData(arrChartTemps);
}

function updateChartConsumption()
{
    chartConsumptions.setData(arrChartConsumption);
}

function updateChartFan()
{
    chartFan.setData(arrChartFan);
}

function updateChartTempsInt()
{
    chartTempsInto.setData(arrChartTempsInto);
}

function updateLastMesurements()
{
    $('#lastTempBack').text(lastTempBack);
    $('#lastTempFront').text(lastTempFront);
    $('#lastConsumption').text(lastConsumption);
    $('#lastFan').text(lastFan);
}
