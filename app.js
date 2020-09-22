var staticUrl = "https://corona-api.com/countries"; //live api with updates to database
var tempHashTable = {};
var sortByConfirmed = {};
var top10Confirmed = {};
var sortByDeaths = {};
var top10Deaths = {};

$.getJSON(staticUrl, function(data){ //show the database in the console
    console.log(data);
});

jQuery.ajax({ //copying everything from .csv file into the hashtable for country name and latitude/longitude
    url: "/CountriesLatLon.csv",
    type: 'get',
    dataType: 'text',
    success: function(data) {
        let lines = data.split('\n');
        let fields = lines[0].split(',');
        
        for(let i = 1; i < lines.length; i++){
           let current = lines[i].split(',');
           tempHashTable[current[3]] = [current[1], current[2]];
        }       
    },
    error: function(jqXHR, textStatus, errorThrow){
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
async function getLat(){ 
  const response = await fetch(staticUrl);
  const d = await response.json();

  for(let i = 0; i < d.data.length; i++){
    confirmedCases = d.data[i].latest_data.confirmed;
    deaths = d.data[i].latest_data.deaths;
    if (tempHashTable.hasOwnProperty(d.data[i].name + "\r")){
      let tempLong = tempHashTable[d.data[i].name + "\r"][1];
      let tempLat = tempHashTable[d.data[i].name + "\r"][0];
      coordinatesData.push([tempLong, tempLat, confirmedCases]);
      sortByConfirmed[d.data[i].name] = confirmedCases; //adding values into sort confirmed array
      sortByDeaths[d.data[i].name] = deaths; //adding values into sort deaths array
    } 
  }

  console.log(sortByConfirmed["Canada"]);

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
            "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        }]
    }
  });


  function quickSortArray (array){ //quick sorts out a list of values from the associative array in order
    counter = 0;
    for (var key in array){
      if (array.hasOwnProperty(key)) counter++;
    } 
    if (counter < 2) return array;

    var pivot = 0;
    var tempStoreKey = "";
    for (var key in array){
      pivot = array[key];
      tempStoreKey = key;
      break;
    }

    var lesserArray = [];
    var greaterArray = [];

    delete array[tempStoreKey];

    for (var key in array){
      if (array[key] > pivot){
        greaterArray.push(array[key]);
      } else {
        lesserArray.push(array[key]);
      }
    }

    return quickSortArray(lesserArray) + " " + pivot + " " + quickSortArray(greaterArray);
  }

  //splits it by " " to put in an array and then removes all the "" values because some used to contain two spaces
  let tempSortByConfirmed = quickSortArray(sortByConfirmed).split(" ");
  let tempSortByConfirmed2 = tempSortByConfirmed.filter(function (e){ return e != ""});

  var keysForConfirmed = Object.keys(tempSortByConfirmed2);
  for (var k = keysForConfirmed.length - 1; k > keysForConfirmed.length - 11; k--){
    for (var key in sortByConfirmed){
      if (sortByConfirmed[key] == tempSortByConfirmed2[keysForConfirmed[k]]){
        top10Confirmed[key] = tempSortByConfirmed2[keysForConfirmed[k]];
      }
    }
  }
  console.log(top10Confirmed);

  //splits it by " " to put in an array and then removes all the "" values because some used to contain two space
  let tempSortByDeaths = quickSortArray(sortByDeaths).split(" ");
  let tempSortByDeaths2 = tempSortByDeaths.filter(function (e){ return e != ""});

  var keysForDeaths = Object.keys(tempSortByDeaths2);
  for (var k = keysForDeaths.length - 1; k > keysForDeaths.length - 11; k--){
    for (var key in sortByDeaths){
      if (sortByDeaths[key] == tempSortByDeaths2[keysForDeaths[k]]){
        top10Deaths[key] = tempSortByDeaths2[keysForDeaths[k]];
      }
    }
  }
  console.log(top10Deaths);

}

getLat(); //calls getLat to run



