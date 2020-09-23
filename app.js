var staticUrl = "https://corona-api.com/countries"; //live api with updates to database
var tempHashTable = {};
var sortByConfirmed = {};
var top10Confirmed = {};
var sortByDeaths = {};
var top10Deaths = {};
var top10Recovered = {};
var top5Recovered = [];
let top5Confirmed = [];
var totalConfirmedCasesNum = 0;

$.getJSON(staticUrl, function (data) { //show the database in the console
  console.log(data);
});

jQuery.ajax({ //copying everything from .csv file into the hashtable for country name and latitude/longitude
  url: "/CountriesLatLon.csv",
  type: 'get',
  dataType: 'text',
  success: function (data) {
    let lines = data.split('\n');
    let fields = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      let current = lines[i].split(',');
      tempHashTable[current[3]] = [current[1], current[2]];
    }
  },
  error: function (jqXHR, textStatus, errorThrow) {
    console.log(textStatus);
  }
});

console.log(tempHashTable); //show the hashtable in the console

//initializing echarts for map and points
var dom = document.getElementById('main');
var chart = echarts.init(dom);
let coordinatesData = []; //array to push to echarts to point to location with dots

//async function to take the data in the hashtable, and match it with the api/database to get each countries
//lat and long and the data within each country, and push them into coordinatesData for the echart to process
async function getLat() {
  const response = await fetch(staticUrl);
  const d = await response.json();

  for (let i = 0; i < d.data.length; i++) {
    confirmedCases = d.data[i].latest_data.confirmed;
    deaths = d.data[i].latest_data.deaths;
    if (tempHashTable.hasOwnProperty(d.data[i].name + "\r")) {
      let tempLong = tempHashTable[d.data[i].name + "\r"][1];
      let tempLat = tempHashTable[d.data[i].name + "\r"][0];
      coordinatesData.push([tempLong, tempLat, confirmedCases]);
      sortByConfirmed[d.data[i].name] = confirmedCases; //adding values into sort confirmed array
      sortByDeaths[d.data[i].name] = deaths; //adding values into sort deaths array
      totalConfirmedCasesNum += confirmedCases;
    }
  }

  chart.setOption({ //setting options for the echart and its functionality
    series: [{
      type: "scatter",
      coordinateSystem: "leaflet",
      data: coordinatesData,
      symbolSize: function (value) {
        return value[2] > 0 ? Math.log(value[2]) : 0;
      },
      itemStyle: {
        color: "red",
      }
    }],
    visualMap: {
      type: "continuous",
      textStyle:{color: '#FFFFFF'},
      min: 0,
      max: 25000,
      inRange: {
        color: ["yellow", "red"],
        opacity: [0.6, 0.9],
      }
    },
    leaflet: {
      center: [0, 40],
      roam: true,
      tiles: [{
        urlTemplate:
          "https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png",
      }]
    }
  });

  function quickSortArray(array) { //quick sorts out a list of values from the associative array in order
    counter = 0;
    for (var key in array) {
      if (array.hasOwnProperty(key)) counter++;
    }
    if (counter < 2) return array;

    var pivot = 0;
    var tempStoreKey = "";
    for (var key in array) {
      pivot = array[key];
      tempStoreKey = key;
      break;
    }

    var lesserArray = [];
    var greaterArray = [];

    delete array[tempStoreKey];

    for (var key in array) {
      if (array[key] > pivot) {
        greaterArray.push(array[key]);
      } else {
        lesserArray.push(array[key]);
      }
    }

    return quickSortArray(lesserArray) + " " + pivot + " " + quickSortArray(greaterArray);
  }

  var dom1 = document.getElementById('donut');
  var chart1 = echarts.init(dom1);
  let deathsData = []; //array to push to donut chart for deaths data

  //splits it by " " to put in an array and then removes all the "" values because some used to contain two space
  let tempSortByDeaths = quickSortArray(sortByDeaths).split(" ");
  let tempSortByDeaths2 = tempSortByDeaths.filter(function (e) { return e != "" });

  var keysForDeaths = Object.keys(tempSortByDeaths2);
  for (var k = keysForDeaths.length - 1; k > keysForDeaths.length - 11; k--) {
    for (var key in sortByDeaths) {
      if (sortByDeaths[key] == tempSortByDeaths2[keysForDeaths[k]]) {
        top10Deaths[key] = tempSortByDeaths2[keysForDeaths[k]];
      }
    }
  }
  console.log(top10Deaths);

  for (var keys in top10Deaths) {
    deathsData.push({value: top10Deaths[keys], name: keys});
  }
  var keysForTop10Deaths = Object.keys(top10Deaths);

  chart1.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{c} deceased'
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      color: ['#c93413', '#a34100', '#c24e00', '#e05a00', '#ff6600', '#ff781f', '#ffab3d', '#fada5e', '#fee591', '#fef4d2'],
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '19',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: deathsData
    }]

  })

  //splits it by " " to put in an array and then removes all the "" values because some used to contain two spaces
  let tempSortByConfirmed = quickSortArray(sortByConfirmed).split(" ");
  let tempSortByConfirmed2 = tempSortByConfirmed.filter(function (e) { return e != "" });

  var keysForConfirmed = Object.keys(tempSortByConfirmed2);
  for (var k = keysForConfirmed.length - 1; k > keysForConfirmed.length - 11; k--) {
    for (var key in sortByConfirmed) {
      if (sortByConfirmed[key] == tempSortByConfirmed2[keysForConfirmed[k]]) {
        top10Confirmed[key] = tempSortByConfirmed2[keysForConfirmed[k]];
      }
    }
  }
  console.log(top10Confirmed);


  for (var keys in top10Confirmed) {
    for (let j = 0; j < d.data.length; j++) {
      if (keys == d.data[j].name) {
        top10Recovered[keys] = d.data[j].latest_data.recovered;
      }
    }
  }

  console.log(top10Recovered);

  var actualKeysForConfirmed = Object.keys(top10Confirmed);

  for (let i = 0; i < 5; i++) {
    top5Confirmed.push(top10Confirmed[actualKeysForConfirmed[i]]);
    for (let keys in top10Recovered) {
      if (actualKeysForConfirmed[i] == keys) {
        top5Recovered.push(top10Recovered[keys]);
      }
    }
  }

  var half = Math.ceil(actualKeysForConfirmed.length / 2);
  var firstHalfActualKeysForConfirmed = actualKeysForConfirmed.splice(0, half);

  console.log(top5Confirmed);
  console.log(top5Recovered);


  var dom2 = document.getElementById('barChart');
  var chart2 = echarts.init(dom2);

  chart2.setOption({
    color: ['#00FF00','#FF0000'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: firstHalfActualKeysForConfirmed,
        axisLabel: {
          textStyle: {
            color: 'white'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: 'white'
          }
        }
      }
    ],
    series: [
      {
        name: 'Recovered',
        type: 'bar',
        barGap: 0,
        data: top5Recovered
      },
      {
        name: 'Confirmed',
        type: 'bar',
        data: top5Confirmed
      }
    ]
  })



  var testarray = Object.keys(top10Confirmed);
  document.getElementById("firstCKey").innerHTML = testarray[0] + ":";
  document.getElementById("firstCValue").innerHTML = top10Confirmed[testarray[0]];

  document.getElementById("secondCKey").innerHTML = testarray[1] + ":";
  document.getElementById("secondCValue").innerHTML = top10Confirmed[testarray[1]];

  document.getElementById("thirdCKey").innerHTML = testarray[2] + ":";
  document.getElementById("thirdCValue").innerHTML = top10Confirmed[testarray[2]];

  document.getElementById("fourthCKey").innerHTML = testarray[3] + ":";
  document.getElementById("fourthCValue").innerHTML = top10Confirmed[testarray[3]];

  document.getElementById("fifthCKey").innerHTML = testarray[4] + ":";
  document.getElementById("fifthCValue").innerHTML = top10Confirmed[testarray[4]];

  document.getElementById("sixthCKey").innerHTML = testarray[5] + ":";
  document.getElementById("sixthCValue").innerHTML = top10Confirmed[testarray[5]];

  document.getElementById("seventhCKey").innerHTML = testarray[6] + ":";
  document.getElementById("seventhCValue").innerHTML = top10Confirmed[testarray[6]];

  document.getElementById("eighthCKey").innerHTML = testarray[7] + ":";
  document.getElementById("eighthCValue").innerHTML = top10Confirmed[testarray[7]];

  document.getElementById("ninthCKey").innerHTML = testarray[8] + ":";
  document.getElementById("ninthCValue").innerHTML = top10Confirmed[testarray[8]];

  document.getElementById("tenthCKey").innerHTML = testarray[9] + ":";
  document.getElementById("tenthCValue").innerHTML = top10Confirmed[testarray[9]];

  document.getElementById("totalval").innerHTML = totalConfirmedCasesNum; 

}

getLat(); //calls getLat to run


