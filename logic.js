// M1.0+ Earthquakes in the last 7 days
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
 
  
// Perform a GET request to the query URL
d3.json(usgsUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


/*  based on http://www.geo.mtu.edu/UPSeis/magnitude.html
Magnitude		Earthquake Effects
2.5 or less		Usually not felt, but can be recorded by seismograph.
2.5 to 5.4		Often felt, but only causes minor damage.
5.5 to 6.0		Slight damage to buildings and other structures
6.1 to 6.9		May cause a lot of damage in very populated areas.
7.0 to 7.9		Major earthquake. Serious damage.
8.0 or greater	Great earthquake. Can totally destroy communities near the epicenter.

assign color based on magnitude:
Magnitude		Earthquake Effects
2.5 or less		#fa9fb5
2.5 to 5.4		#f768a1
5.5 to 6.0		#dd3497
6.1 to 6.9		#ae017e
7.0 to 7.9		#7a0177
8.0 or greater	#49006a

*/

function createFeatures(earthquakeData) {
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

	// assign color based on magnitude
	style: function(feature) {
		var color = "";
		if (feature.properties.mag >= 8.0) {
			color = "#49006a";.0
		}
		else if (feature.properties.mag >= 7.0 ) {
			color = "#7a0177";
		}
		else if (feature.properties.mag >= 6.1 ) {
			color = "#ae017e";
		}
		else if (feature.properties.mag >= 5.5 ) {
			color = "#dd3497";
		}
		else if (feature.properties.mag >= 2.5 ) {
			color = "#f768a1";
		}
		else {
			color = "#fa9fb5";
		}

        return {
        	color: color,
			fillColor: color,
        };
    },

	// add circle marker, base size on magnitude
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
        	radius: feature.properties.mag * 3,
        	fillOpacity: 0.85
        });
    },
    //onEachFeature: onEachFeature
	onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "  -  Magnitude:" + feature.properties.mag +
			"</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
 // Set up the legend
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd=function(){
	  
  var div=L.DomUtil.create("div", "info legend");
  var magitudes=["2.5 or less","2.5 to 5.4", "5.5 to 6.0", "6.1 to 6.9", "7.0 to 7.9", "8.0 or greater"];
  var colorList = ["#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"];
  var labels = [];
  
  var legendInfo = "<h1>Magnitude</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + magitudes[0] + "</div>" +
        "<div class=\"max\">" + magitudes[magitudes.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;
	concole.log(legendInfo);
	
    colorList.forEach(function(colorList, index) {
      labels.push("<li style=\"background-color: " + colorList[index] + "\"></li>");
    });

/*
	for (var i = 0; i < colorList.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + colorList[i] + '"></i> ' +
            (magitudes[i] ? magitudes[i] : '+'));

        }
    
	div.innerHTML += labels.join('<br>');	
*/
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
	
	console.log(div);

	//div.innerHTML='<div><b>Legend</b></div';	
    return div;  
  };
  // Adding legend to the map
  //legend.addTo(Map);

};