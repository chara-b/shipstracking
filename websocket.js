process.title = 'node_streaming_server';
var webSocketsServerPort = 8000;
var clients = [];

var WebSocketServer = require('websocket').server;
var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");

var server = http.createServer(function(request, response) {
	var done = finalhandler(request, response);
	serve(request, response, done);
});

server.listen(webSocketsServerPort, function() { 
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

// create the server
wsServer = new WebSocketServer({
	httpServer: server
});

//a variable to store the remoteAddress of the conncted client
var remoteAddress;

var batchSizeInSec = 60;	//this defines the record batches that the system will create. E.g. record batches for 5'' (if the value is 5)
var dataRate = 0.25; //this defines the rate at which the data batches will be sent to the client. IF batchSizeInSec and dataRate are equal, then this means: real time.

wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

	// accept connection
	var connection = request.accept(null, request.origin); 
	// we need to know the clients' index to remove them on 'close' event
	var index = clients.push(connection) - 1;

	remoteAddress = connection.remoteAddress;
	console.log((new Date()) + ' Connection accepted from: ' +remoteAddress);

	console.log("Sending data to remote client "+remoteAddress);
	getAndSendLine(connection);

	connection.on('close', function(connection) {
		// close user connection
		console.log((new Date()) + " Peer " + remoteAddress + " disconnected.");
		// remove user from the list of connected clients
		clients.splice(index, 1);
	});
});

var fs = require('fs');
var util = require('util');
var stream = require('stream')
var es = require('event-stream');

//an array to store records with the same timestamp
var recordBuffer = [];

function getAndSendLine(connection){
	var vessel = require('./vessel');
	var lineNr = 0;
	var callbackRegistered = false;

	//var s = fs.createReadStream('/home/tserpes/Downloads/humanitarian_hd_201508.csv')
	var s = fs.createReadStream('./final.csv')
	.pipe(es.split())
	.pipe(es.mapSync(function(line){

		// pause the readstream
		s.pause();
		lineNr += 1;

		// process line here and call s.resume() when rdy function below was for logging memory usage
		vessel.load(line.split(','));
		var vessel_clone = clone(vessel);	//create a deep copy of vessel

		console.log('vessel_clone ', vessel_clone)
		var feature = {
			"type": "Feature" ,
			"properties": {
				"id": parseInt(vessel_clone['id']),
				"imo": parseInt(vessel_clone['imo']),
				"lat": parseFloat(vessel_clone['lat']), 
				"lng": parseFloat(vessel_clone['lng']),
				"course": parseInt(vessel_clone['course']),
				"heading": parseInt(vessel_clone['heading']),
				"speed": parseInt(vessel_clone['speed']),
				"timestamp": new Date(vessel_clone['timestamp']),
				"name": vessel_clone['name'],
				"type_name": vessel_clone['type_name'],
				"destination": vessel_clone['destination'],
				"navigation": vessel_clone['navigation'],
				"show_on_map": true,
			},
			"geometry": {
				"type": "Point",
				"coordinates":  [parseFloat(vessel_clone['lng']), parseFloat(vessel_clone['lat'])] ,    
				
			}
		}

		var foundfeaturewithsameid = recordBuffer.find(f => {
			return (f.properties.id === parseInt(vessel_clone['id']) && f.properties.show_on_map === true);
		});
		if(foundfeaturewithsameid){ // when the array at the beginning is empty this will be undefined and we want to run this loop only when it's not so it has something inside to find
			   
			recordBuffer[ recordBuffer.indexOf(foundfeaturewithsameid) ].properties.show_on_map = false;
	 
		}
		
		//we're sending objects in batches
		if (recordBuffer.length == 0){	//start the batch
			recordBuffer.push(feature);
			s.resume();
		} else {
			if (vessel.timestamp - recordBuffer[0].timestamp < batchSizeInSec){	//make e.g. 5'' batches
				recordBuffer.push(feature);
				s.resume();
			} else {
				setTimeout(function(){
					//console.log(JSON.stringify(process.memoryUsage()));
					


					connection.sendUTF(JSON.stringify(recordBuffer));	//send the batch
					//recordBuffer = [];	//clear the array for the new n sec batch
					recordBuffer.push(feature);
					s.resume();
				}, dataRate*2000);
			}
		}
	})
	.on('error', function(err){
		console.log('Error while reading file.', err);
	})
	.on('end', function(){
		console.log('Read entire file.')
	})
	);
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}
