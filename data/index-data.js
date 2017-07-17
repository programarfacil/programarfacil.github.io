var tiempoRefresh = 10000;
var numberResults = 300;
var macUser = '';
var nameFridge = '';
var numberBins = 360;
var namePeriod = '6/hours';


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
                beginAtZero:true
            }
        }]
    }
}

var optionsChartTemps = {
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
    options: optionsChartTemps
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

$(document).ready(function() {

    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];

        if(hash[0]=='mac')
        {
            macUser = hash[1];
        }
        else if (hash[0]=='nameFridge')
        {
            nameFridge = hash[1];
        }
        else if (hash[0] == 'numberBins')
        {
            numberBins = parseInt(hash[1]);
        }
        else if (hash[0] == 'namePeriod')
        {
            namePeriod = hash[1];
        }
    }

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
            arrChartConsumptionData.push(childSnapshot.val().consumption);
            arrChartFanData.push(childSnapshot.val().timeFan);
            arrChartTempFreData.push(childSnapshot.val().tempFre);
            arrChartTempFriData.push(childSnapshot.val().tempFri);

            lastTempBack = childSnapshot.val().tempInt;
            lastConsumption = childSnapshot.val().consumption;
            lastFan = childSnapshot.val().timeFan;
            lastTempFre = childSnapshot.val().tempFre;
            lastTempFri = childSnapshot.val().tempFri;

            if(childSnapshot.val().tempOut == null)
            {
                arrChartTempFrontData.push(childSnapshot.val().tempout);
                lastTempFront = childSnapshot.val().tempout;
            }
            else
            {
                arrChartTempFrontData.push(childSnapshot.val().tempOut);
                lastTempFront = childSnapshot.val().tempOut;
            }
        });

        arrChartTempsInt.push({
                label: 'Temp. Freezer ºC',
                backgroundColor: "rgba(170, 200, 226, 0.8)",
                data: arrChartTempFreData
            },{
                label: 'Temp. Fridge ºC',
                backgroundColor: "rgba(7, 101, 180, 0.8)",
                data: arrChartTempFriData 
            }
        );

        arrChartFan.push({
            label: 'Fan on minutes',
            backgroundColor: "rgba(60, 118, 61, 0.8)",
            data: arrChartFanData
        });

        arrChartConsumption.push({
            label: 'Consumption Wh',
            backgroundColor: "rgba(214, 11, 11, 0.8)",
            data: arrChartConsumptionData
        });

        arrChartTemps.push({
                label: 'Temp. Front ºC',
                backgroundColor: "rgba(21, 88, 29, 0.8)",
                data: arrChartTempFrontData
            },{
                label: 'Temp. Back ºC',
                backgroundColor: "rgba(134, 8, 8, 0.8)",
                data: arrChartTempBackData 
            }
        );

        updateChartTemps();
        updateChartConsumption();
        updateChartFan();
        updateChartTempsInt();

        updateLastMesurements();
    });

    // Create links periods
    $("#link6hours").attr("href", "index.html?mac="+macUser+"&nameFridge="+nameFridge+"&numberBins=360&namePeriod=6/hours");
    $("#link12hours").attr("href", "index.html?mac="+macUser+"&nameFridge="+nameFridge+"&numberBins=720&namePeriod=12/hours");
    $("#link1day").attr("href", "index.html?mac="+macUser+"&nameFridge="+nameFridge+"&numberBins=1440&namePeriod=1/day");
    $("#link2days").attr("href", "index.html?mac="+macUser+"&nameFridge="+nameFridge+"&numberBins=2880&namePeriod=2/days");
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
    $('#nameAndMac').text("(" + nameFridge + ") " + macUser);
    $('#titleDashboard').text("Dashboard (" + namePeriod + ")");
}

