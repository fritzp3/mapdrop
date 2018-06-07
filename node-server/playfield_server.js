// Including libraries
var app = require('http').createServer(handler), io = require('socket.io').listen(app), static = require('node-static'); 


// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./');

  
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(8080);


var nicknames = {};


// Create object to hold all map resources and persist data across connections. 
var mapResourceList_obj = {};


// If the URL of the socket server is opened in a browser
function handler (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response);
  });
}


// Delete this row if you want to see debug messages
io.set('log level', 1);


// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {


  console.log('Socket server connection established...')


  // pass the mapResourceList_obj to the client so she could setup the current map. 
  socket.on('socketClientSender_initializeNodeServer', function (data, fn) { 
    io.sockets.emit('socketClientReciever_initializeNodeServer', mapResourceList_obj); 
  });
  

  // Begin building Node/Redis server
  socket.on('submitUsername', function (nickname, fn) {
    //console.log('socket function: submitUsername: ' + nickname); 
    io.sockets.emit('outputUsername', nickname);
  });




  //Communication the zooming and panning of the map with socket.io
  //Revisit later.  More important to be able to communicate the addition of map resources. 
  /*socket.on('clientSocketZoomIn', function (e) { 
    //console.log('socket function: server clientSocketZoomIn: ' + zoom); 
    //io.sockets.emit('serverSocketZoomIn', zoom);
    socket.broadcast.emit('serverSocketZoomIn', e);
  });*/ 
  


  socket.on('socketClientSender_addMapElement', function (data) { 
    
    data.sender = false; 
    mapResourceList_obj[data.name] = { 
      'id':data.id, 'name': data.name, 'domElementId':data.domElementId, 'x':data.x, 'y':data.y 
    }

     /*
    //console.log(mapResourceList_obj); 

    if (Object.keys(mapResourceList_obj) == 0) {
      mapResourceList_obj[data.name] = { 
        'id':data.id, 'name': data.name, 'domElementId':data.domElementId, 'x':111, 'y':222 
      }
    } else {


      for (var resource in mapResourceList_obj) { 

        //console.log(resource); 
        var obj = mapResourceList_obj[resource]; 
        console.log("obj['name']: " + obj['name']);
        console.log("data.name: " + data.domElementId);  


        if ( obj['name'] == data.name ) {
          console.log('gotta match'); 
        } else {
          console.log('NOOOOOOOO match'); 
                                                                      
        }

        for ( var prop in obj ) {
          if( obj.hasOwnProperty( prop ) ) {
            //console.log(prop + " = " + obj[prop]); 
          }
        }

        //var newSocketMapResourceId = document.getElementById(obj.domElementId); 
        //addMapElement(newSocketMapResourceId, false); 

      }
    


    }*/  



    //console.log(mapResourceList_obj); 
    //socket.broadcast.emit('socketClientReceiver_addMapElement', mapResourceList_obj, function () { 
    socket.broadcast.emit('socketClientReceiver_addMapElement', data, function () { 
      //console.log(mapResourceList_obj); 
    }); 



    
  });


    
  
  socket.on('socketClientSender_moveMapElement', function (data) { 
    
    //console.log('socketClientSender_MoveMapElement: ');
    //console.log(data); 
    data.sender = false; 
    socket.broadcast.emit('socketClientReceiver_moveMapElement', data); 
    
  });







  socket.on('socketClientSender_dropMapElement', function (data) { 
    
    console.log('socketClientSender_dropMapElement: ');

    /*
    socketClientSender_dropMapElement: 
    { 
      sender: true,
      x: 387,
      y: 64.00001101286443,
      id: 26,
      name: 'mapResource_1379679229495' 
    }
    { 
      mapResource_1379679224320: 
       { id: 23,
         name: 'mapResource_1379679224320',
         domElementId: 'police_officer',
         x: 480,
         y: 230 
       },
      mapResource_1379679229495: 
       { id: 26,
         name: 'mapResource_1379679229495',
         domElementId: 'police_car',
         x: 480,
         y: 230 
       } 
    }
    */

    for (var resource in mapResourceList_obj) { 

      var newMapResource_obj = mapResourceList_obj[resource];
      console.log(newMapResource_obj);

      mapResourceList_obj[data.name].x = data.x; 
      mapResourceList_obj[data.name].y = data.y; 


    }


    /*
    


    data.sender = false; 
    socket.broadcast.emit('socketClientReceiver_moveMapElement', data); 
    */
  });







});


