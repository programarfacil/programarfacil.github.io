var tiempoRefresh = 10000;
var numberResults = 300;
var macUser = 'A020A61AF950';
var numberBins = 400;


var arrChartTemps = [];
var arrChartConsumption = [];
var arrChartFan = [];
var arrChartTempsInt = [];

var arrLabelsChart = [];

var lastTempBack = -1;
var lastTempFront = -1;
var lastTempFri = -1;
var lastTempFre = -1;
var lastConsumption = -1;
var lastFan = -1;

var optionsChart = {
    responsive:true,
    bezierCurve: true,
    animation: {
        duration:0
    },
    elements: {
        point: {
            radius:1 
        }
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:false
            }
        }]
    }
}

var ctxTemps = document.getElementById("temps-chart").getContext('2d');
var chartTemps = new Chart(ctxTemps, {
    type: 'line',
    data: {
    },
    options: optionsChart
});

var ctxConsumption = document.getElementById("consumption-chart").getContext('2d');
var chartConsumption = new Chart(ctxConsumption, {
    type: 'line',
    data: {
    },
    options: optionsChart
});

var ctxFan = document.getElementById("fan-chart").getContext('2d');
var chartFan = new Chart(ctxFan, {
    type: 'line',
    data: {
    },
    options: optionsChart
});

var ctxTempInt = document.getElementById("tempsint-chart").getContext('2d');
var chartTempInt = new Chart(ctxTempInt, {
    type: 'line',
    data: {
    },
    options: optionsChart
});

// Set the configuration for your app
var config = {
    authDomain: 'fridgesaverdata.firebaseapp.com',
    databaseURL: 'https://fridgesaverdata.firebaseio.com',
    storageBucket: 'fridgesaverdata.appspot.com'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


var starCountRef = firebase.database().ref(macUser).limitToLast(numberBins);
starCountRef.on('value', function(snapshot) {
    var arrChartTempBackData = [];
    var arrChartTempFrontData = [];
    var arrChartConsumptionData = [];
    var arrChartFanData = [];
    var arrChartTempFreData = [];
    var arrChartTempFriData = [];

    arrLabelsChart = [];
    arrChartTemps = [];
    arrChartConsumption = [];
    arrChartFan = [];
    arrChartTempsInt = [];

    snapshot.forEach(function(childSnapshot) {
        arrLabelsChart.push(childSnapshot.key.toString().substr(childSnapshot.key.toString().indexOf(' ') + 1));

        arrChartTempBackData.push(childSnapshot.val().tempInt);
        arrChartTempFrontData.push(childSnapshot.val().tempOut);
        arrChartConsumptionData.push(childSnapshot.val().consumption);
        arrChartFanData.push(childSnapshot.val().timeFan);
        arrChartTempFreData.push(childSnapshot.val().tempFre);
        arrChartTempFriData.push(childSnapshot.val().tempFri);

        lastTempFront = childSnapshot.val().tempOut;
        lastTempBack = childSnapshot.val().tempInt;
        lastConsumption = childSnapshot.val().consumption;
        lastFan = childSnapshot.val().timeFan;
        lastTempFre = childSnapshot.val().tempFre;
        lastTempFri = childSnapshot.val().tempFri;
    });

    arrChartTempsInt.push({
            label: 'Temp. Freezer ºC',
            backgroundColor: "rgba(203, 136, 18, 0.5)",
            data: arrChartTempFreData
        },{
            label: 'Temp. Fridge ºC',
            backgroundColor: "rgba(173, 144, 92, 0.5)",
            data: arrChartTempFriData 
        }
    );

    arrChartFan.push({
        label: 'Fan on minutes',
        backgroundColor: "rgba(60, 118, 61, 0.5)",
        data: arrChartFanData
    });

    arrChartConsumption.push({
        label: 'Consumption Wh',
        backgroundColor: "rgba(169, 68, 66, 0.5)",
        data: arrChartConsumptionData
    });

    arrChartTemps.push({
            label: 'Temp. Front ºC',
            backgroundColor: "rgba(49, 112, 143, 0.5)",
            data: arrChartTempFrontData
        },{
            label: 'Temp. Back ºC',
            backgroundColor: "rgba(138, 109, 59, 0.5)",
            data: arrChartTempBackData 
        }
    );

    updateChartTemps();
    updateChartConsumption();
    updateChartFan();
    updateChartTempsInt();

    updateLastMesurements();
});

function updateChartTemps()
{
    chartTemps.data.labels = arrLabelsChart;
    chartTemps.data.datasets = arrChartTemps;
    chartTemps.update();
}

function updateChartConsumption()
{
    chartConsumption.data.labels = arrLabelsChart;
    chartConsumption.data.datasets = arrChartConsumption;
    chartConsumption.update();
}

function updateChartFan()
{
    chartFan.data.labels = arrLabelsChart;
    chartFan.data.datasets = arrChartFan;
    chartFan.update();
}

function updateChartTempsInt()
{
    chartTempInt.data.labels = arrLabelsChart;
    chartTempInt.data.datasets = arrChartTempsInt;
    chartTempInt.update();
}

function updateLastMesurements()
{
    $('#lastTempBack').text(lastTempBack);
    $('#lastTempFront').text(lastTempFront);
    $('#lastConsumption').text(lastConsumption);
    $('#lastTempFridge').text(lastTempFri);
    $('#lastTempFreezer').text(lastTempFre);
    $('#lastFan').text(lastFan);
}