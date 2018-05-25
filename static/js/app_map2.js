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

// Create overlay object to hold our overlay layer
let overlayMaps = {
    "Honey Production 1998": honeyprod,
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

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control
  .layers(baseMaps, overlayMaps)
  .addTo(myMap);

d3.json("/map-data", function(response){
    console.log(response);

    // Define a markerSize function that will give each total production qty a different radius 
    function markerSize(psize) {
        return psize / 100;
        }

    function getColor(totprod) {
        return totprod > 38689000 ? '#f30' :
            totprod > 30968000  ? '#f60' :
            totprod > 23247000  ? '#f90' :
            totprod > 15526000  ? '#fc0' :
            totprod > 7805000  ? '#ff0' :
                    '#9f3';
        }

    // Loop through the cities array and create one marker for each city object
    for (let i = 0; i < response.length; i++) {
        let lat = response[i].latitude;
        let lon = response[i].longitude;
        //console.log(lat);
            
        L.circle([lat, lon], {
            fillOpacity: 0.7,
            color: "black",
            fillColor: getColor(response[i].totalprod),
            weight: 0.5,
            clickable: true,
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its prodtotal
            radius: markerSize(response[i].totalprod),
        }).bindPopup("<h1>" + response[i].state_yr + "</h1> <hr> <h3>Total Production: " + 
        response[i].totalprod + "</h3>").addTo(honeyprod);
    };
    honeyprod.addTo(myMap);

    // Create legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            
        prods = [0, 7805000, 15526000, 23247000, 30968000, 38689000],
        colors = ['#9f3', '#ff0', '#fc0', '#f90', '#f60', '#f30'];
                
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
    
})
