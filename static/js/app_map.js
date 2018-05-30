console.log("display the data");

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

// Add the layers for honey production and temperatures
let honeyprod = new L.LayerGroup();
let temp_1998 = new L.LayerGroup();
let temp_1999 = new L.LayerGroup();
let temp_2000 = new L.LayerGroup();
let temp_2001 = new L.LayerGroup();
let temp_2002 = new L.LayerGroup();
let temp_2003 = new L.LayerGroup();
let temp_2004 = new L.LayerGroup();
let temp_2005 = new L.LayerGroup();
let temp_2006 = new L.LayerGroup();
let temp_2007 = new L.LayerGroup();
let temp_2008 = new L.LayerGroup();
let temp_2009 = new L.LayerGroup();
let temp_2010 = new L.LayerGroup();
let temp_2011 = new L.LayerGroup();
let temp_2012 = new L.LayerGroup();

// Creating a basemap object (radio buttons)
let baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap,
    "Temperatures (1998)": temp_1998,
    "Temperatures (1999)": temp_1999,
    "Temperatures (2000)": temp_2000,
    "Temperatures (2001)": temp_2001,
    "Temperatures (2002)": temp_2002,
    "Temperatures (2003)": temp_2003,
    "Temperatures (2004)": temp_2004,
    "Temperatures (2005)": temp_2005,
    "Temperatures (2006)": temp_2006,
    "Temperatures (2007)": temp_2007,
    "Temperatures (2008)": temp_2008,
    "Temperatures (2009)": temp_2009,
    "Temperatures (2010)": temp_2010,
    "Temperatures (2011)": temp_2011,
    "Temperatures (2012)": temp_2012,
};


// Create overlay object to hold our overlay layer (checkbox)
let overlayMaps = {
    "Honey Production": honeyprod,
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
  .layers(baseMaps, overlayMaps, {collapsed: false})
  .addTo(myMap);

  

///////////////////////////////
/// d3 for temperature data ///
///////////////////////////////

d3.json("/temp-data2", function(response){
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
    };

    // Define a styling function for our GeoJSON layer so that its fillColor depends 
    // on feature.properties.temperatures[].temp_max property
    //1998
    function style1(feature) { 
            return {
                fillColor: getColor(feature.properties.temperatures[0].temp_max),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.5,
            };   
    };
    L.geoJson(response, {style: style1}).addTo(temp_1998);
    temp_1998.addTo(myMap);

    //1999
    function style2(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[1].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style2}).addTo(temp_1999);
    temp_1999.addTo(myMap);    

    //2000
    function style3(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[2].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style3}).addTo(temp_2000);
    temp_2000.addTo(myMap);  

    //2001
    function style4(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[3].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style4}).addTo(temp_2001);
    temp_2001.addTo(myMap);

    //2002
    function style5(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[4].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style5}).addTo(temp_2002);
    temp_2002.addTo(myMap);

    //2003
    function style6(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[5].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style6}).addTo(temp_2003);
    temp_2003.addTo(myMap);

    //2004
    function style7(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[6].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style7}).addTo(temp_2004);
    temp_2004.addTo(myMap);

    //2005
    function style8(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[7].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style8}).addTo(temp_2005);
    temp_2005.addTo(myMap);

    //2006
    function style9(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[8].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style9}).addTo(temp_2006);
    temp_2006.addTo(myMap);

    //2007
    function style10(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[9].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style10}).addTo(temp_2007);
    temp_2007.addTo(myMap);

    //2008
    function style11(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[10].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style11}).addTo(temp_2008);
    temp_2008.addTo(myMap);

    //2009
    function style12(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[11].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style12}).addTo(temp_2009);
    temp_2009.addTo(myMap);

    //2010
    function style13(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[12].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style13}).addTo(temp_2010);
    temp_2010.addTo(myMap);

    //2011
    function style14(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[13].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style14}).addTo(temp_2011);
    temp_2011.addTo(myMap);

    //2012
    function style15(feature) { 
        return {
            fillColor: getColor(feature.properties.temperatures[14].temp_max),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5,
        };   
    };
    L.geoJson(response, {style: style15}).addTo(temp_2012);
    temp_2012.addTo(myMap);    


    // Define an event listener for layer mouseover event
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.3
        });
    };

    // Define what happens on mouseout for each layer
    function resetHighlight1(e) {
        geojson1.resetStyle(e.target);
    };
    function resetHighlight2(e) {
        geojson2.resetStyle(e.target);
    };
    function resetHighlight3(e) {
        geojson3.resetStyle(e.target);
    };
    function resetHighlight4(e) {
        geojson4.resetStyle(e.target);
    };
    function resetHighlight5(e) {
        geojson5.resetStyle(e.target);
    };
    function resetHighlight6(e) {
        geojson6.resetStyle(e.target);
    };
    function resetHighlight7(e) {
        geojson7.resetStyle(e.target);
    };
    function resetHighlight8(e) {
        geojson8.resetStyle(e.target);
    };
    function resetHighlight9(e) {
        geojson9.resetStyle(e.target);
    };
    function resetHighlight10(e) {
        geojson10.resetStyle(e.target);
    };
    function resetHighlight11(e) {
        geojson11.resetStyle(e.target);
    };
    function resetHighlight12(e) {
        geojson12.resetStyle(e.target);
    };
    function resetHighlight13(e) {
        geojson13.resetStyle(e.target);
    };
    function resetHighlight14(e) {
        geojson14.resetStyle(e.target);
    };
    function resetHighlight15(e) {
        geojson15.resetStyle(e.target);
    };

    // specify popup options 
    let customOptions1 =
        {
        'className' : 'popupCustom1'
        };

    // Use the onEachFeature option to add the listeners on our state layers
    //1998
    function onEachFeature1(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight1,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[0].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[0].temp_max + " F", customOptions1).addTo(temp_1998);
    };
    temp_1998.addTo(myMap);

    //1999
    function onEachFeature2(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight2,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[1].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[1].temp_max + " F", customOptions1).addTo(temp_1999);
    };
    temp_1999.addTo(myMap);

    //2000
    function onEachFeature3(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight3,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[2].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[2].temp_max + " F", customOptions1).addTo(temp_2000);
    };
    temp_2000.addTo(myMap);

    //2001
    function onEachFeature4(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight4,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[3].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[3].temp_max + " F", customOptions1).addTo(temp_2001);
    };
    temp_2001.addTo(myMap);

    //2002
    function onEachFeature5(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight5,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[4].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[4].temp_max + " F", customOptions1).addTo(temp_2002);
    };
    temp_2002.addTo(myMap);

    //2003
    function onEachFeature6(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight6,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[5].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[5].temp_max + " F", customOptions1).addTo(temp_2003);
    };
    temp_2003.addTo(myMap);

    //2004
    function onEachFeature7(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight7,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[6].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[6].temp_max + " F", customOptions1).addTo(temp_2004);
    };
    temp_2004.addTo(myMap);

    //2005
    function onEachFeature8(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight8,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[7].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[7].temp_max + " F", customOptions1).addTo(temp_2005);
    };
    temp_2005.addTo(myMap);

    //2006
    function onEachFeature9(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight9,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[8].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[8].temp_max + " F", customOptions1).addTo(temp_2006);
    };
    temp_2006.addTo(myMap);

    //2007
    function onEachFeature10(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight10,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[9].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[9].temp_max + " F", customOptions1).addTo(temp_2007);
    };
    temp_2007.addTo(myMap);

    //2008
    function onEachFeature11(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight11,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[10].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[10].temp_max + " F", customOptions1).addTo(temp_2008);
    };
    temp_2008.addTo(myMap);

    //2009
    function onEachFeature12(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight12,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[11].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[11].temp_max + " F", customOptions1).addTo(temp_2009);
    };
    temp_2009.addTo(myMap);

    //2010
    function onEachFeature13(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight13,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[12].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[12].temp_max + " F", customOptions1).addTo(temp_2010);
    };
    temp_2010.addTo(myMap);

    //2011
    function onEachFeature14(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight14,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[13].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[13].temp_max + " F", customOptions1).addTo(temp_2011);
    };
    temp_2011.addTo(myMap);

    //2012
    function onEachFeature15(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight15,                
        }).bindPopup("<h2>" + feature.properties.name + " (" + feature.properties.temperatures[14].year + ")" + "</h2> <hr> <h3>Max Temp: " + 
                feature.properties.temperatures[14].temp_max + " F", customOptions1).addTo(temp_2012);
    };
    temp_2012.addTo(myMap);

    //1998
    geojson1 = L.geoJson(response, {       
        style: style1,
        onEachFeature: onEachFeature1,
    }).addTo(temp_1998);
    temp_1998.addTo(myMap);

    //1999
    geojson2 = L.geoJson(response, {       
        style: style2,
        onEachFeature: onEachFeature2,
    }).addTo(temp_1999);
    temp_1999.addTo(myMap);

    //2000
    geojson3 = L.geoJson(response, {       
        style: style3,
        onEachFeature: onEachFeature3,
    }).addTo(temp_2000);
    temp_2000.addTo(myMap);

    //2001
    geojson4 = L.geoJson(response, {       
        style: style4,
        onEachFeature: onEachFeature4,
    }).addTo(temp_2001);
    temp_2001.addTo(myMap);

    //2002
    geojson5 = L.geoJson(response, {       
        style: style5,
        onEachFeature: onEachFeature5,
    }).addTo(temp_2002);
    temp_2002.addTo(myMap);

    //2003
    geojson6 = L.geoJson(response, {       
        style: style6,
        onEachFeature: onEachFeature6,
    }).addTo(temp_2003);
    temp_2003.addTo(myMap);

    //2004
    geojson7 = L.geoJson(response, {       
        style: style7,
        onEachFeature: onEachFeature7,
    }).addTo(temp_2004);
    temp_2004.addTo(myMap);

    //2005
    geojson8 = L.geoJson(response, {       
        style: style8,
        onEachFeature: onEachFeature8,
    }).addTo(temp_2005);
    temp_2005.addTo(myMap);

    //2006
    geojson9 = L.geoJson(response, {       
        style: style9,
        onEachFeature: onEachFeature9,
    }).addTo(temp_2006);
    temp_2006.addTo(myMap);

    //2007
    geojson10 = L.geoJson(response, {       
        style: style10,
        onEachFeature: onEachFeature10,
    }).addTo(temp_2007);
    temp_2007.addTo(myMap);

    //2008
    geojson11 = L.geoJson(response, {       
        style: style11,
        onEachFeature: onEachFeature11,
    }).addTo(temp_2008);
    temp_2008.addTo(myMap);

    //2009
    geojson12 = L.geoJson(response, {       
        style: style12,
        onEachFeature: onEachFeature12,
    }).addTo(temp_2009);
    temp_2009.addTo(myMap);

    //2010
    geojson13 = L.geoJson(response, {       
        style: style13,
        onEachFeature: onEachFeature13,
    }).addTo(temp_2010);
    temp_2010.addTo(myMap);

    //2011
    geojson14 = L.geoJson(response, {       
        style: style14,
        onEachFeature: onEachFeature14,
    }).addTo(temp_2011);
    temp_2011.addTo(myMap);

    //2012
    geojson15 = L.geoJson(response, {       
        style: style15,
        onEachFeature: onEachFeature15,
    }).addTo(temp_2012);
    temp_2012.addTo(myMap);



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
        };
        return div;
    };

    legend.addTo(myMap); 

    //Adding slider for the temp data
    //   var sliderControl = L.control.sliderControl({position: "topright", layer: temp, follow: 52});
    //   myMap.addControl(sliderControl);
    //   sliderControl.startSlider();

});


/////////////////////////////
/// d3 for honeyprod data ///
/////////////////////////////

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

    // specify popup options 
    let customOptions2 =
        {
        'className' : 'popupCustom2'
        };
    
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
        "</h2> <hr> <h3>Total Honey Production: " + response[i].totalprod / 1000000 + 
        "M lbs" + "</h3>", customOptions2).addTo(honeyprod);
    };
    honeyprod.addTo(myMap);

    // Create legend
    let legend = L.control({position: 'bottomleft'});

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
    let sliderControl2 = L.control.sliderControl({position: "topright", layer: honeyprod, follow: 52});
    myMap.addControl(sliderControl2);
    sliderControl2.startSlider();
    
})

