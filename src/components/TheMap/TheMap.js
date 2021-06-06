import { Button, makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState, createContext, useContext, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TheMap.css';
import ChangeThemeColor, {myContext} from '../ChangeThemeColor/ChangeThemeColor';



export const mapfeatureContext = createContext(null);


const useStyles = makeStyles({
    map: {
        height: '500px',
        width: '900px',
        maxWidth: '900px',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignContent: 'space-around',
        flexWrap: 'nowrap',
        marginTop: '30px',
        marginLeft: '40px',
    },
  });



const TheMap = props => {
    const {usercolor, setUserColorValue} = useContext(myContext);
    const {userlettercolor, setUserLetterColor} = useContext(myContext);
    const {userbuttoncolor, setUserButtonColor} = useContext(myContext);
    const {featureclickedonmap, setFeatureclickedonmap} = useContext(myContext);
    const classes = useStyles();
    const [filecontents, setFilecontents] = useState([]);
    const [extractedValues, setExtractedFeatureClickedValues] = useState();
    const [removePaths, setRemovePaths] = useState(false);
   // let mapcontainerref = useRef()
    // const mapcontainer = mapcontainerref.current;
    useEffect(() => {

       // console.log(filecontents)
  
   // if(L.DomUtil.get('mymap')._leaflet_id === null){
    //    container._leaflet_id = null;
       var mymap = L.map('mapid', {preferCanvas: true}).setView([36.97554, 12.57211], 5);

       L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
       }).addTo(mymap);
  // }

function whenClicked(e) { // auti i methodos tha pigenei ta data tou feature pou patithike ston xarti stin karta deksia stin othoni
     // console.log(e.target.feature);
    // group all features with same id together and then create an array with their coordinations in such way so that the polyline accepts them
    var current_label = 'A';
    var segmentsArray = [];
    var groupedFeatures = groupBy(filecontents, 'id', e.target.feature.properties.id); // group first parameter's array according to value id of 2nd parameter...
    var c = [];  // holds the coordinates in a form that a polyline needs
    var p = [];
    var counter = 0;
    var segment;
    for(let elmt of groupedFeatures[e.target.feature.properties.id]){
        groupedFeatures[e.target.feature.properties.id][groupedFeatures[e.target.feature.properties.id].indexOf(elmt)].properties.show_on_map = true;
        var x = elmt.properties.lat;
        var y = elmt.properties.lng;
        counter++;
      //  current_label = elmt.properties.navigation;
        p.push([x, y]); // holds the coordinates in a form that a polyline needs in order to be drawn
        if(elmt.properties.navigation === current_label){
            c.push([x, y]); // holds the coordinates in a form that a polyline needs in order to be drawn
            if(counter === groupedFeatures[e.target.feature.properties.id].length){ // this is needed to take into consideration of adding the last group of same labels in the segments array of the polyline of the map
                segment = L.polyline(c).setStyle({
                    color: 'green',
                    weight: 15
                }).addTo(mymap);
                segmentsArray.push(segment);
                c.length = 0;
            }
        } else {
            segment = L.polyline(c).setStyle({
                color: 'green',
                weight: 15
            }).addTo(mymap);
            segmentsArray.push(segment);
            c.length = 0; // c array is getting filled with all points under same label which form the whole segment
            // and when we find the whole segment we need to empty this array so it can store the next segment 
            // before emptying it we save its segment inside the polyLineArray and slowly slowly each single segment
            // that we form will end up form the whole polyline at the end !
            current_label = elmt.properties.navigation;
            c.push([x, y]);

        }
        
    }
    segmentsArray.forEach(function (segment, index) {
        segment.on('mouseover', function(e) {
            var layer = e.target;
            //e.target.bringToFront();
            layer.setStyle({
                color: 'yellow',
                weight: 15,
                opacity: 0.5
            });
        });
        segment.on('mouseout', function(e) {
            var layer = e.target;
    
            layer.setStyle({
                color: 'green',
                weight: 15,
                opacity: 1
            });
        });
       // L.polyline(segment).addTo(map);
    });


  //  var polyline2 = L.polyline(p).setStyle({
    //    color: 'green'
  //  }).addTo(mymap);
    var polyline = L.polyline(p).setStyle({
        color: 'green'
    }).addTo(mymap);

    mymap.fitBounds(polyline.getBounds());
 
 //   var highlight = {
  //      'fillColor': 'purple',
 //       'weight': 2,
 //       'opacity': 1
 //   };
// groupedfeatures array has a key and then this key's values are all the same features that we re found
// the name of that key is the id that obviously all the same features have that's why inside geoJSON layer
// i added an array with an index of target.feature.properties.id because we ask the grouped features from the 
// grouped features array where the name of the key equals the id that was asked when user clicked and then 
// the click event has that id we need to search for... FYI this array has only one record because it groups over a specific id
// but it also adds as key that id so in order to grab all its contents we need to specify that key name although
// that's the only key it has!
        var SameFeaturesLayer = L.geoJSON(groupedFeatures[e.target.feature.properties.id],{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(feature.properties.name).openTooltip();
              //  return L.marker(latlng);
            },
            onEachFeature:  function (feature, layer) {
                var popupContent = '<h1><b>Navigation: </b>'+ feature.properties['navigation'] +'</h1><table>';
                for (var p in feature.properties) {
                    if(p !== "show_on_map" && p !== "navigation"){
                    popupContent += "<tr><td><b>" + p + "<b>:</b>" + "</b></td><td>"+ feature.properties[p] + "</td></tr>";
                    }
                }
                popupContent += "</table>";
                    layer.bindPopup(popupContent);
                    setFeatureclickedonmap("\""+popupContent+"\"")
                    layer.on({
                        click: whenClicked
                    });
                  //  layer.on("mouseover", function (e) { 
                     //  stateLayer.setStyle(style); //resets layer colors
                    //    layer.setStyle(highlight);  //highlights selected.
                  //  });
          
            },
            style:  function(feature){
                switch (feature.properties.id) { 
                    case feature.properties.id: return { fillColor: "red", weight:20, color: 'purple', opacity: 0.5 };
                   // case 'some other id': return { color: "green" };
                }
            },
            filter: function(feature, layer) {
                return feature.properties.show_on_map;
            },
        }).addTo(mymap);

        masterLayerGroup.addLayer(SameFeaturesLayer);
        masterLayerGroup.addLayer(polyline);
    //    masterLayerGroup.addLayer(polyline2);
        masterLayerGroup.addLayer(segment);
       // masterLayerGroup.addLayer(polyline3);
        
        

/*
if(removePaths === true){
    if (mymap.hasLayer(pathLine)){
        mymap.removeLayer(pathLine) 
        masterLayerGroup.removeLayer(pathLine);
    }
    if (mymap.hasLayer(SameFeaturesLayer)){
        mymap.removeLayer(SameFeaturesLayer)
        masterLayerGroup.removeLayer(SameFeaturesLayer);
    }      
}
*/
}

/*
var myIcon = L.icon({
    iconUrl: './ship.png',
    iconSize: [18, 28]
});
*/
var geojsonMarkerOptions = {
    radius: 5,
    fillColor: "#2b3740",
    color: "#000",
    weight: 1,
    opacity: 0.3,
    fillOpacity: 0.5
};
        var allFeaturesLayer = L.geoJSON(filecontents,{
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(feature.properties.name).openTooltip();
                // return L.marker(latlng, {icon: myIcon});
            },
            onEachFeature:  function (feature, layer) {
                var popupContent = '<h1><b>Navigation: </b>'+ feature.properties['navigation'] +'</h1><table>';
                for (var p in feature.properties) {
                    if(p !== "show_on_map" && p !== "navigation"){
                    popupContent += '<tr><td><b>' + p + '<b>:</b>' + '</b></td><td>'+ feature.properties[p] + '</td></tr>';
                    }
                }
                popupContent += '</table>';
                    layer.bindPopup(popupContent);
                    layer.on({
                        click: whenClicked
                    });
                    layer.on('mouseover', function () {
                        this.setStyle({
                          'fillColor': 'yellow'
                        });
                        
                      });
                      layer.on('mouseout', function () {
                        this.setStyle({
                          'fillColor': '#2b3740'
                        });
                      });
           
                  //  setExtractedFeatureClickedValues({ ...extractedValues, popupContent })
                  //  setFeatureclickedonmap(popupContent)
            },
            filter: function(feature, layer) {
                return feature.properties.show_on_map;
            },
        }
        ).addTo(mymap);
/*
        if (mymap.hasLayer(allFeaturesLayer)){
            allFeaturesLayer.remove();
        }
*/
        var masterLayerGroup = L.layerGroup().addTo(mymap);
        masterLayerGroup.addLayer(allFeaturesLayer);

        var controlLayers = L.control.layers().addTo(mymap);
        controlLayers.addOverlay(masterLayerGroup, 'General Cargo types only (click to show/hide on the map)');
 

      return () => { // this return here is actually a way to clean my previous map before rendering it again
            // otherwise it'll throw an error of saying that my map container is already initialized!
            // The [] as a 2nd argument passed here in useEffect Hook indicates that this useEffect Hook is only
            // gonna render once the component loads and after it is mounted this code here is not gonna render again
            // also if i had passed nothing as a 2nd argument there this hook would render every time a change occured
            // and if i had passed some state variables from useState hook this code here would render every single time 
            // one of those variables would change!
          
         //   masterLayerGroup.remove();
      mymap.remove();
      //  mymap.removeLayer(SameFeaturesLayer)
          
  } 
       
    },[filecontents, removePaths]);
    
function removeLineofPath() {
    if(removePaths === false){
        setRemovePaths(true)   
    } else {
        setRemovePaths(false)   
    }
}


const parseFile = (files) => {

    var worker;
        if (typeof(Worker) !== "undefined") {
        if(typeof(worker) == "undefined") {
           //  worker = new Worker('../../myworker.js');
           worker = new Worker('../../../worker.js');
        }
        worker.postMessage(files[0]);
        worker.onerror = (err) => console.log(err);
    
      

            worker.onmessage = (event) => {
                console.log(event.data) // incoming feature from the worker is printed on the console here!
               // features.length = 0 // prepei na ton katharizoume prin baloume to epomeno feature mesa tou gt
                // an den to kanoume otan tha ginei concat pio kato me to filecontents pou einai allis embeleias
                // pou xreiazomaste na exoume prosbasi apo tin methodo auti giati apo tin filecontents akouei o xartis
                // diladi pexoume me closures i onload den blepei tin embeleia tis pio pano methodou para mono tin embeleia
                // tis methodou stin opoia anikei kai auti einai i embeleia tis methodou parseFile
                
               /* 
                if(!Array.isArray(event.data)){
                    var foundfeaturewithsameid = filecontents.find(f => {
                        return (f.properties.id === event.data.properties.id && f.properties.show_on_map === true);
                    });
                    if(foundfeaturewithsameid){ // when the array at the beginning is empty this will be undefined and we want to run this loop only when it's not so it has something inside to find         
                       
                    filecontents[ filecontents.indexOf(foundfeaturewithsameid) ].properties.show_on_map = false;
        
                    }
                } 
                */
             //   setFilecontents(filecontents => filecontents.concat(event.data))
            // setTimeout(function(){  setFilecontents(event.data) }, 5000);
             setFilecontents(event.data) 
                  
                if(!event) { // ean den erthei kapoio feature apo ton worker tote kleise ton worker gt teleiose i douleia tou...
                    worker.terminate();
                    worker = undefined; // If you set the worker variable to undefined, after it has been terminated, you can reuse the code
                    
                }
            }


    

            
         console.log(filecontents)
      } else {
        alert('Sorry your browser doesn\'t support WebWorkers therefore this app can\'t run...');
      }
      /* Den tha to xrisimopoiiso auto den mou kanei alla as to afiso os sxolio kai blepo...
               Papa.parse(files[0], {
                worker: true,
                chunk: function(results) {
                    console.log("Chunk:", results.data);
                        //below line appends at the end of the 'lines' array the resuls.data
                        // if i had it like so --> [results.data, ...lines] it would append at the beginning of
                        // the array!
                        // setLines(lines => [...lines, results.data])
                      console.log(lines)
            
                },
                complete: function() {
                    console.log("All done!");
                }
            }); 
            */
                
        };

    
function groupBy(objectArray, property, id) { // group by same id so when click on the map on a feauture 
    // with a specific id all the rest points of same id appear with a line as the path we want to depict
    // found this function here --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Grouping_objects_by_a_property
// episis edo allaksa ligo tin domi tis function pou brika sto parapano link oste na einai simbati me ton
// array of objects pou tis dino na mou kanei group...
    return objectArray.reduce((acc, obj) => { 
    let key = obj.properties[property] // the key of each group in the final array result
    if (!acc[key] && key === id) { // if the above key doesn't exist in the accumulator array/the final array with the groups that's what accumulator means
        acc[key] = [] // add an array ready to be filled with objects inside that reflect the key/each group array inside accumulator array in other words
    }
    if(obj.properties.id === id) { // if you find an object with the id that we want to group get it and push it into corresponding group array... we don't need the other groupings of the dataset just the objects with the same id that the user clicked upon the map to show...
        acc[key].push(obj)
    }
    return acc
    }, []);
}
    ////////// PROSOXI Below is the template min berdeuto 
    /////////  kai nomizo oti exo balei 2 return gia tin groupBy !!!!!!! ///////////////////////////////
    return (
        <div>
        <div id="mapid" className={classes.map}></div>
        <Button onClick={removeLineofPath} style={{display: 'flex', float: 'right', backgroundColor: userbuttoncolor, color: userlettercolor, marginRight: '150px', marginTop: '10px'}}>Remove all paths</Button>
       {/* <input style={{display: 'flex', marginLeft: '40px'}} type="file" name="csvinput" id="csvinput" onChange={(e) => parseFile(e.target.files) }/>*/}
       <label className="custom-file-upload" style={{backgroundColor: userbuttoncolor, color: userlettercolor}}>
            <input type="file" id="file-upload" name="csvinput" id="csvinput" onChange={(e) => parseFile(e.target.files) }/>
            <i className="fa fa-cloud-upload"></i> Upload csv Dataset
        </label>
        
        
        
        
        </div>
    );

}




export default TheMap;