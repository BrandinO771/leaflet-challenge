


//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////  BY: BRANDON STEINKE
///////   THIS PROJECT IS PLOTS EARTHQUAKE LOCATIONS ON GLOBAL MAP
//////    CIRCLES INDICATE LOCATION, SIZE OF EARTHQUAKE
//////    TOOLTIPS GIVE - DESCRIP, MAGNITUDE, LONGITUDE, LATTITUDE
/////     A LEGEND PROVIDES COLOR CODED DESCRIPTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// --  Creating map object  -- //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
var map = L.map("map", 
    {
    center: [0, 2],
    zoom: 2.2
    });
  
  // Adding tile layer//////////
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);



/////////////////////////////////////////////////////////////////////////////
// -- API LINKS -- //
/////////////////////////////////////////////////////////////////////////////

// LINK BELOW IS USGS API DOC:
//   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)

// LINK BELOW ALL PAST WEEK 4.5+ EARTHQUAKES :
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

// LINK BELOW ALL EARTHQUAKES PAST 7 DAYS :
 var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"



/////////////////////////////////////////////////////////////////////////////
// -- JSON -- //
/////////////////////////////////////////////////////////////////////////////

  d3.json(link, function(response) 
    {  
      // console.log("this is the response length", response.features.length);

    //////////////////////////////////////////////////////////////
    //// API FOR LON LAT below this works !//////////////////////
    // var location = response.features[0].geometry.coordinates
    // console.log("this coordinates ", location[0], location[1]);


    /////////////////////////////////////////////////////////////////////////////////////
     //// GRAB JSON FROM USGS // SET VARIABLES FOR TOOLTIPS AND CIRCLES FOR MARKERS
    ////////////////////////////////////////////////////////////////////////////////////
        for (var i = 0; i < response.features.length; i++) 
            {
                var location = response.features[i].geometry.coordinates;
                var titled = response.features[i].properties.title;
                var magn = response.features[i].properties.mag;
                // console.log("this is var locaiton: " ,location)
                // console.log("this is the coordinates",location[0], location[1]);
                if (location) 
                {
                var color = "";
                var opacity_val = 0.0;
                var zDep = 0.0;
                var rad_val = 0.0;
                
                if (magn >= 6)  {  console.log(magn, location, titled, "and the interation is :" , i);   }

                //////////// CONDITIONAL FORMAT CIRCLES ////////////////////////
                    if (magn >= 6)
                        {
                          color = "purple";
                          zDep = -2.0;
                          opacity_val = .8;
                          rad_val = ( 60000 * magn);
                        }
                    else if  (magn >= 5)
                        {
                          color = "red";
                          zDep = -2.0;
                          opacity_val = .75;
                          rad_val = 35000 * magn;
                        }
                    else if (magn >= 4) 
                        {
                          color = "orange";
                          zDep = -1.0;
                          opacity_val = .70;
                          rad_val = 20000 *magn;
                        }
                    else if (magn >= 3) 
                        {
                          color = "yellow";
                          zDep = 0.0;
                          opacity_val= .6;
                          rad_val = 10000 * magn;
                        }
                    else 
                        {
                          color = "blue";
                          zDep = 1.0;
                          opacity_val = .5;
                          rad_val = 5000 * magn;
                        }

                   /// BUILD CIRCLES ////     
                  // console.log( "this is the mags ", response.features[i].properties.mag),
                  L.circle(  [  location[1],  location[0] ] ,
                                    {
                                    fillOpacity: opacity_val,
                                    stroke: false,  
                                    fillColor: color,
                                    // Setting our circle's radius equal to the output of our markerSize function
                                    radius: rad_val, 
                                    }  
                                  ) 
                  /// ADD TOOL TIPS ////
                .bindPopup( "<h3> Description: " + titled  + "</h3><h4>Lattitude:" + location[1] + "</h4><h4>Longitude:" + location[0] + "</h4>") 
                .addTo(map);
            }
          }
    });

    
        //////////////////////////////////////////////////////////////////////////
        ////// Set up the legend //////////////////////
        //////////////////////////////////////////////////////////////////////////

        var legend = L.control({ position: "topright" });
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info_legend");
          var labels = [];
          leg_data=  [
                        {    color : "purple",  mags : "Magnitude: 6+"   },
                        {    color : "red",     mags : "Magnitude: 5-5.9" },
                        {    color : "orange",  mags : "Magnitude: 4-4.9" },
                        {    color : "yellow",  mags : "Magnitude: 3-3.9" },
                        {    color : "blue",    mags : "Magnitude: 0-2.9" }
                      ]
      
          // Add min & max
          var legendInfo = "<h3>*  Magnitude By Color   : </h3>" + 
          "<div  class=\" labels \">" +"</div>";
      
          div.innerHTML = legendInfo;

          leg_data.forEach(function(k)
            {
            // div.innerHTML += "<ul>" + "<li style=\"background-color: " + k.color + ";" + "opacity:.75;" +"width:100px;"+ "color: black;" +"font-weight: bold;" + "\">" +k.mags + "</li>"   + "</ul>";
            div.innerHTML += "<ul>" + "<li style=\"background-color: " + k.color + ";" +"width:130px;"+ "color: black;" +"font-weight: bold;" + "\">" +k.mags + "</li>" + "</ul>";
            });

          return div;
        };
      
        // // Adding legend to the map
        legend.addTo(map);


