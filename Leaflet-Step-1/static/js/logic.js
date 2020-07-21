//bring in geojson link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//bring json in with d3
d3.json(link, function(data) {
    console.log(data);

    //create function that displayes the earthquakes
    //using chooseColor to indicate magnitude
    function createCircleMarker(feature, latlng) {
        let options = {
            radius: feature.properties.mag * 4,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker(latlng, options)
    }

    //add popup to each earthquake
    //contains: place, magnitude and timestamp
    var earthQuakes = L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Place:" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag + "<br> Time: " + Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker
    });
    createMap(earthQuakes)

});

//create map with mapbox
function createMap(earthQuakes) {


    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: config.API_KEY
    });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satellite,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthQuakes
    };

    // Create our map
    var myMap = L.map("map", {
        center: [
            37.0902405, -95.7128906
        ],
        zoom: 4,
        layers: [satellite, earthQuakes]
    });


    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML = displayLegend();

}

//change the color of the earthquake based on mag
function chooseColor(mag) {
    switch (true) {
        case (mag < 1):
            return "lightgreen";
        case (mag < 2):
            return "greenyellow";
        case (mag < 3):
            return "gold";
        case (mag < 4):
            return "DarkOrange";
        case (mag < 5):
            return "darkred";
        default:
            return "white";
    };
}


//display color legend
function displayLegend() {
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "lightgreen"
    }, {
        limit: "Mag: 1-2",
        color: "greenyellow"
    }, {
        limit: "Mag: 2-3",
        color: "gold"
    }, {
        limit: "Mag: 3-4",
        color: "DarkOrange"
    }, {
        limit: "Mag: 4-5",
        color: "darkred"
    }, {
        limit: "Mag: 5+",
        color: "red"
    }];

    var header = "<h3>Magnitude</h3>";

    var strng = "";

    for (i = 0; i < legendInfo.length; i++) {
        strng += "<p style = \"background-color: " + legendInfo[i].color + "\">" + legendInfo[i].limit + "</p> ";
    }

    return header + strng;

}