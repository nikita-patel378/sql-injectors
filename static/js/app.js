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
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

// Create overlay object to hold our overlay layer
let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
};

// Creating map object
let myMap = L.map("map-id", {
    center: [34.0522, -118.2437],
    zoom: 4,
    layers: [satelliteMap, grayscaleMap, outdoorsMap]
  });

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=" +
  "pk.eyJ1Ijoic2hpbHBhayIsImEiOiJjamgxYWlydWwwMWgyMnFsZnc0ZDlqdTB4In0.pUco4Q1dH4FnKxljrs-0qg").addTo(myMap);


let earthquake_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'


// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control
  .layers(baseMaps, overlayMaps)
  .addTo(myMap);

d3.json(earthquake_url, function(response){
    console.log(response);

    // Define a markerSize function that will give each place a different radius based on 
    // the earthquake's magnitude
    function markerSize(magnitude) {
        return magnitude * 50000;
        }

    function getColor(magnitude) {
        return magnitude > 5 ? '#f30' :
            magnitude > 4  ? '#f60' :
            magnitude > 3  ? '#f90' :
            magnitude > 2  ? '#fc0' :
            magnitude > 1  ? '#ff0' :
                    '#9f3';
        }

    // Loop through the cities array and create one marker for each city object
    for (let i = 0; i < response.features.length; i++) {
        let lon = response.features[i].geometry.coordinates[0];
        let lat = response.features[i].geometry.coordinates[1];
        let prop = response.features[i].properties;
            
        L.circle([lat, lon], {
            fillOpacity: 0.7,
            color: "black",
            fillColor: getColor(prop.mag),
            weight: 0.5,
            clickable: true,
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its magnitude
            radius: markerSize(prop.mag),
        }).bindPopup("<h1>" + prop.place + "</h1> <hr> <h3>Magnitude: " + prop.mag + "</h3>")
            .addTo(earthquakes);
    };
    earthquakes.addTo(myMap);

    // Create legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            
        magnitudes = [0, 1, 2, 3, 4, 5],
        colors = ['#9f3', '#ff0', '#fc0', '#f90', '#f60', '#f30'];
                
        // loop through the status values and generate a label with a coloured square for each value
        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + " '></i> " 
                + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] 
                + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(myMap);
    
})
