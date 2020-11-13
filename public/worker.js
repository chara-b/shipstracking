
// Respond to message from parent thread

self.addEventListener('message', async (event) => {
    console.log('worker is running ... Now parsing ...')
    console.log('ev', event.data)

/*
    Papa.parse(event.data, {
        worker: true,
        chunk: function(results) {
            console.log("Chunk:", results.data);
            results.forEach(chunk => {
                self.postMessage(chunk);
            });
    
        },
        complete: function() {
            console.log("All done!");
            self.postMessage('done');
        }
    }); 
    */
   try {


    //Parse large file in to small chunks
    var chunkSize = 1024 * 1024 * 1; //1MB Chunk size
    var file = event.data;
    var fileSize = file.size;
    var currentChunk = 1;
    var totalChunks = Math.ceil((fileSize/chunkSize)); // strogilopoiisi
    var chunks = [];
    console.log('Total file size: ', fileSize)
    console.log('Total chunks: ', totalChunks) 
    console.log('Chunk size: ', chunkSize)

    while (currentChunk <= totalChunks) {

        var offset = (currentChunk-1) * chunkSize;
        var currentFilePart = event.data.slice(offset, (offset+chunkSize));

       
        console.log('Chunk ', currentChunk, ' created...');
     //   console.log('Current chunk data', currentFilePart);
  
       // let row = await readFileAsync(currentFilePart);
      //  var reader = new FileReader();
      chunks.push(currentFilePart)
    //  if(!row){
       // console.log(chunks)
        currentChunk++; 
    //  }
        
         // start reading the file. When it is done, calls the onload event defined above.
       //  reader.readAsText(currentFilePart);

       //  reader.onload = () => { 
        //   var chunk_array = reader.result.split('\n') // result is of type text we need an array of lines
         //   chunk_array.forEach(element => { 
           //     const row = element.split(',')
              //  self.postMessage(row); // eslint-disable-line no-restricted-globals 
               // console.log(row)
           // });
        

           // for(let i = 0; i < chunk_array.length; i++) {
             //   self.postMessage(reader.result[i]); // eslint-disable-line no-restricted-globals 
             //}
             // currentChunk++; 
         }
         for(let i = 0; i < chunks.length; i++) { // apothikeuo ta chunks pou egine cut to arxeio se pinaka kai
            // stelno ena - ena meta gia diabasma sti methodo ... ean den to ekana auto tote tha mou diabaze toses
            // fores osa ta chunks ta data apo to teleutaio mono chunk pou tha tou estelna na diabasei...
            await readFileAsync(chunks[i]);
         }
        } catch(err) {
            console.log(err);
          }
    
 
        
   // }

})


function readFileAsync(file) {

    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      var chunk_features = [];

      reader.onload = () => {

      //  chunk_features.length = 0;
        var chunk_array = reader.result.split('\n') // result is of type text we need an array of lines.. so we make the whole chunks which comes in this method into an array of lines
        chunk_array.forEach(element => { // for each line split on commas and create an array with all values of the line... the element represents the whole line here from the above array
        var row_values = element.split(',')
       
            if(row_values.length === 11) { // some lines while cutting in chunks were splitted in half and first half was saved in previous chunk and second half in next chunk which makes it hard to create a feature out of this case so we exclude them, these lines are of a length less than all the features starting from 0 to 10 so they are less than 11 items in the values array and they are found only at the point of cutting into chunks so it is the last line of the chunk only which causes this bad cut into chunks


                var feature = {
                    "type": "Feature" ,
                    "properties": {
                        "id": parseInt(row_values[0]),
                        "imo": parseInt(row_values[1]),
                        "lat": parseFloat(row_values[2]), 
                        "lng": parseFloat(row_values[3]),
                        "course": parseInt(row_values[4]),
                        "heading": parseInt(row_values[5]),
                        "speed": parseInt(row_values[6]),
                        "timestamp": new Date(row_values[7]),
                        "name": row_values[8],
                        "type_name": row_values[9],
                        "destination": row_values[10],
                        "show_on_map": true,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates":  [parseFloat(row_values[3]), parseFloat(row_values[2])] ,    
                        
                    }
                }
                // check if exists and if yes disable its show_on_map property so the previous points don't show
              //  if(chunk_features.length > 0){
                 //   for(let elmt of chunk_features){
                  //      if(elmt.properties.id === parseInt(row_values[0])){ // ean to id tou feature pou paei na bei tora ston chunk_array iparxei idi
                   //         chunk_features[chunk_features.indexOf(elmt)].properties.show_on_map = false; // kane to show_on_map property false tou idi iparxontos oste na bei to neo me true sto property auto kai na einai to teleutaio pou tha fainetai ston xarti...
                           // elmt.properties.show_on_map = false;
                    //    }
                  //  }
              //  }
                function sameId(f) { // f stands for feature
                    return f.properties.id === parseInt(row_values[0]);
                  }
                var foundfeaturewithsameid = chunk_features.find(sameId);
                if(foundfeaturewithsameid){ // when the array at the beginning is empty this will be undefined and we want to run this loop only when it's not so it has something inside to find
                    while(foundfeaturewithsameid.properties.show_on_map === true){
                       
                        chunk_features[ chunk_features.indexOf(foundfeaturewithsameid) ].properties.show_on_map = false;
                        var foundfeaturewithsameid = chunk_features.find(sameId);
                    }
                }
               // foundfeaturewithsameid.properties.show_on_map = false;
              //  chunk_features[ chunk_features.indexOf(foundfeaturewithsameid) ].properties.show_on_map = false;
                chunk_features.push(feature) // add the new point with show_on_map property enabled
                
              //  self.postMessage(feature);
            }


     
      
        })

        self.postMessage(chunk_features);
    // self.postMessage(chunk_array)
        resolve(true); // resolve otan i onload teleiosei
      };
      
      reader.onerror = reject; // reject an brethei error
  
      reader.readAsText(file); // diabase to chunk kai steilto stin onload na kanei to parsing...
    })
  }
// checkIfFeatureExistsToDisableShowOnMapPropertyAndThenPushNewFeatureIn
//function DisablePreviousFeaturesShowOnMapProperty(id) {
    
    
//}
