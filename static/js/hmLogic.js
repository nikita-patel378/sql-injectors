let csv = document.getElementById("data").innerHTML;    

// CSV string splitting
function CSVtoArray(text) {
  return text.replace(/^"/, '')
    .replace(/",$/, '')
    .split('","');
}

csv = csv.split(/\n/);
// console.log(csv)

let states = {},
  mapChart,
  stateChart,
  numRegex = /^[0-9\.]+$/,
  lastCommaRegex = /,\s$/,
  quoteRegex = /\"/g,
  categories = CSVtoArray(csv[1]).slice(4);
  //console.log(categories);

// Parse the CSV into arrays, one array each state
// Colony population for each state from 1998-2012
$.each(csv.slice(3), function (j, stateRow) {
  let row = CSVtoArray(stateRow),
    data = row.slice(4);
    //console.log(data);

  $.each(data, function (i, val) {
    val = val.replace(quoteRegex, '');
    if (numRegex.test(val)) {
      val = parseInt(val, 10);
    } else if (!val || lastCommaRegex.test(val)) {
      val = null;
    }
    data[i] = val;
    //console.log(val);
  });

  states[row[1]] = {
    name: row[0],
    abbr: row[1],
    data: data
  };
});

// For each state, use the latest value for 2012 population
let data = [];
for (let abbr in states) {
  if (states.hasOwnProperty(abbr)) {
    let value = null,
      year,
      itemData = states[abbr].data,
      i = itemData.length;

    while (i--) {
      if (typeof itemData[i] === 'number') {
        value = itemData[i];
        year = categories[i];
        break;
      }
    }
    data.push({
      name: states[abbr].name,
      abbr: abbr,
      value: value,
      year: year
    });
  }
}
//console.log(data);

// Retrieve Map from Highcharts geojson
let mapData = Highcharts.geojson(Highcharts.maps['countries/us/us-all']);

// Wrap point.select to get to the total selected points
Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

  proceed.apply(this, Array.prototype.slice.call(arguments, 1));

  let points = mapChart.getSelectedPoints();
  if (points.length) {
    $('#info .subheader').html('<h4>Colony Population</h4><small><em>Shift + Click on map to compare states</em></small>');

    if (!stateChart) {
      stateChart = Highcharts.chart("state-chart", {
        chart: {
          height: 250,
          spacingLeft: 0
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        subtitle: {
          text: null
        },
        xAxis: {
          tickPixelInterval: 50,
          crosshair: true
        },
        yAxis: {
          title: null,
          opposite: true
        },
        tooltip: {
          split: true
        },
        plotOptions: {
          series: {
            animation: {
              duration: 500
            },
            marker: {
              enabled: false
            },
            threshold: 0,
            pointStart: parseInt(categories[0], 10)
          }
        }
      });
    }

    $.each(points, function (i) {
      // Update
      if (stateChart.series[i]) {
        stateChart.series[i].update({
          name: this.name,
          data: states[this.abbr].data,
          type: points.length > 1 ? 'line' : 'area'
        }, false);
      } else {
        stateChart.addSeries({
          name: this.name,
          data: states[this.abbr].data,
          type: points.length > 1 ? 'line' : 'area'
        }, false);
      }
    });
    while (stateChart.series.length > points.length) {
      stateChart.series[stateChart.series.length - 1].remove(false);
    }
    stateChart.redraw();

  } else {
    $('#info h2').html('');
    $('#info .subheader').html('');
    if (stateChart) {
      stateChart = stateChart.destroy();
    }
  }
});

// Initiate the map chart
mapChart = Highcharts.mapChart('container', {

  title: {
    text: 'Bee Colony Population by State'
  },

  subtitle: {
    text: 'From 1998 to 2012'
  },

  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: 'bottom'
    }
  },

  colorAxis: {
    type: 'logarithmic',
    endOnTick: false,
    startOnTick: false,
    min: 50000
  },

  tooltip: {
    footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
  },

  series: [{
    data: data,
    mapData: mapData,
    joinBy: ['hc-a2', 'abbr'],
    name: '2012 population',
    allowPointSelect: true,
    cursor: 'pointer',
    states: {
      select: {
        color: '#a4edba',
        borderColor: 'black',
        dashStyle: 'shortdot'
      }
    }
  }]
});

// Pre-select a state
// mapChart.get('CA').select();
