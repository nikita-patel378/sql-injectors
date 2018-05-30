console.log("testing");

// Define variables for our base layers
let satelliteMap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYnJ5YW5sb3dlIiwiYSI6ImNqZ3p2bThxNTA4M3Yyd25vdGQxY2xqeXQifQ.URpIhwM_YJcAJYOyzbZEdQ"
  );
let grayscaleMap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYnJ5YW5sb3dlIiwiYSI6ImNqZ3p2bThxNTA4M3Yyd25vdGQxY2xqeXQifQ.URpIhwM_YJcAJYOyzbZEdQ"
  );
let outdoorsMap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYnJ5YW5sb3dlIiwiYSI6ImNqZ3p2bThxNTA4M3Yyd25vdGQxY2xqeXQifQ.URpIhwM_YJcAJYOyzbZEdQ"
  );

// Creating a basemap object
let baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
};

// Add the layers for earthquakes and tectonic plates
let honeyprod = new L.LayerGroup();
let temp = new L.LayerGroup();

// Create overlay object to hold our overlay layer
let overlayMaps = {
    "Honey Production": honeyprod,
    "Temperatures": temp
};

// Creating map object
let myMap = L.map("map-id", {
    center: [40.809868, -96.675345],
    zoom: 4,
    layers: [satelliteMap, grayscaleMap, outdoorsMap]
  });

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=" +
  "pk.eyJ1Ijoic2hpbHBhayIsImEiOiJjamgxYWlydWwwMWgyMnFsZnc0ZDlqdTB4In0.pUco4Q1dH4FnKxljrs-0qg").addTo(myMap);


// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control
  .layers(baseMaps, overlayMaps)
  .addTo(myMap);



/// d3 for temp data

d3.json("/temp-data1", function(response){
    console.log(response);

    // Create a function that returns a color based on max temp
    function getColor(t) {
        return t > 86.65 ? '#800026' :
               t > 83.3  ? '#BD0026' :
               t > 79.95 ? '#E31A1C' :
               t > 76.6  ? '#FC4E2A' :
               t > 73.25 ? '#FD8D3C' :
               t > 69.9  ? '#FEB24C' :
               t > 66.55 ? '#FED976' :
                          '#FFEDA0';
    }

    // Define a styling function for our GeoJSON layer so that its fillColor depends 
    // on feature.properties.temp_max property
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.temp_max_1998),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }
    L.geoJson(response, {style: style}).addTo(temp);

    // Define an event listener for layer mouseover event
    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.3
        });
    
        // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        //     layer.bringToFront();
        // }
    }

    // Define what happens on mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    // Use the onEachFeature option to add the listeners on our state layers
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            //click: zoomToFeature
        }).bindPopup("<h2>" + feature.properties.name + "</h2> <hr> <h3>Max Temp: " + 
        feature.properties.temp_max_1998 + " F").addTo(temp);
    };
    temp.addTo(myMap) ;
    

    geojson = L.geoJson(response, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(temp);
    temp.addTo(myMap);

    // Add Legend
    let legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (myMap) {

        let div = L.DomUtil.create('div', 'info legend'),
            tems = ["0", "66.55", "69.9", "73.25", "76.6", "79.95", "83.3", "86.65"];
            colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];            
            label = ['<strong> Temperatures (in F) </strong>'];
        // Add a title to the Legend
        div.innerHTML = label + ('<br>');
        // loop through our density intervals and generate a label with a colored square for each interval

        for (var i = 0; i < tems.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                tems[i] + (tems[i + 1] ? '&ndash;' + tems[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap); 

})  



/// d3 for honeyprod data

d3.json("/map-data", function(response){
    console.log(response);

    // Define a markerSize function that will give each total production qty a different radius 
    function markerSize(psize) {
        return psize / 150;
        }

    function getColor(totprod) {
        return totprod > 38689000 ? '#006d2c' :
            totprod > 30968000  ? '#31a354' :
            totprod > 23247000  ? '#a1d99b' :
            totprod > 15526000  ? '#74c476' :
            totprod > 7805000  ? '#31a354' :
                    '#006d2c';
        }
    
    // Loop through the states array and create one marker for each city object
    for (let i = 0; i < response.length; i++) {
        let lat = response[i].latitude;
        let lon = response[i].longitude;
        //console.log(res);
            
        L.circle([lat, lon], {
            fillOpacity: 1,
            color: "black",
            fillColor: getColor(response[i].totalprod),
            weight: 0.5,
            clickable: true,
            time: response[i].year,
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its prodtotal
            radius: markerSize(response[i].totalprod),
        }).bindPopup("<h2>" + response[i].state_full+ " (" + response[i].year + ")" +
        "</h2> <hr> <h3>Total Production: " + response[i].totalprod / 1000000 + 
        "M lbs" + "</h3>").addTo(honeyprod);
    };
    honeyprod.addTo(myMap);

    // Create legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            
        prods = ["0", "7.81", "15.53", "23.25", "30.96", "38.69"],
        colors = ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'];
        label = ['<strong> Honey Production (in mil) </strong>'];
        // Add a title to the Legend
        div.innerHTML = label + ('<br>');
                
        // loop through the status values and generate a label with a coloured square for each value
        for (let i = 0; i < prods.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + " '></i> " 
                + prods[i] + (prods[i + 1] ? "&ndash;" + prods[i + 1] 
                + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(myMap);

    //Adding slider for the total production data
    var sliderControl = L.control.sliderControl({position: "topright", layer: honeyprod, follow: 44});
    myMap.addControl(sliderControl);
    sliderControl.startSlider();
    
})

