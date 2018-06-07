/*
 * Class: init
 * Description: Incapsulates the initial progress bar loading. 
 * Author: Fritz Padilla III
 * Date: 08.29.2013
 *  
 */ 

var isMobile, loadingBar, mapImage1, map, mapResource1, mapScale, mapResourceScale, doc, socket; 
var userName, newUser; 

function init() {

  newUser = true; 

  // test arrays to set fake user names.  Replace with user names.
  var randNames = new Array("foo", "bar", "baz", "chuck");
  userName = randNames[Math.floor(Math.random() * randNames.length)];

  // create socket.io connection
  socket = io.connect('http://192.168.33.11:8080');

  // connect to socket.io
  socket.on('connect', function () {
    console.log('socket client sender function: client connect'); 
  });

  socket.emit('submitUsername', userName, function (nickname) { 
    console.log('socket function: client submitUsername'); 
    return $('#connected').html('nickname-set'); 
  }); 

  socket.on('outputUsername', function (nicknames) { 
    $('#nicknames').empty().append($('<span>Online: </span>')); 
      for (var i in nicknames) { 
      $('#connected').append($('<b>').text(nicknames[i])); 
    } 
  });

  
  socket.on('socketClientReceiver_addMapElement', function (resource) {  
    if (!resource.sender) {
      var newSocketMapResourceImage = document.getElementById(resource.domElementId); 
      var newSocketMapResourceName = resource.name;
      addMapElement(newSocketMapResourceImage, false, newSocketMapResourceName); 
    }
  });

  socket.on('socketClientReceiver_moveMapElement', function (e) { 
    if (!e.sender) {      
      var mapResourceReference = map.getChildByName(e.name); 
      mapResourceReference.x = e.x; 
      mapResourceReference.y = e.y; 
    }
  });

  canvas = document.getElementById("playfieldCanvas");
  stage = new createjs.Stage(canvas);
  
  isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  stage.mouseEventsEnabled = true;
  
  //creating the progress label
  loadProgressLabel = new createjs.Text("","15px Arial","black");
  loadProgressLabel.lineWidth = 400;
  loadProgressLabel.textAlign = "center";
  loadProgressLabel.x = canvas.width/2;
  loadProgressLabel.y = 50;
  stage.addChild(loadProgressLabel);
  
  //creating a loading bar from our class and passing some arguments
  loadingBar = new LoadingBar(400, 40, 5, "gray", "black"); 
  
  //adding the container with the elements to our stage
  stage.addChild(loadingBar);
  
  //creating the loading queue and the events for progress and completion
  preload = new createjs.LoadQueue(false);
  preload.addEventListener("complete", handleLoadingComplete);
  preload.addEventListener("progress", handleLoadingProgress);
  
  //adding our files to the queue
  preload.loadManifest(
    [ 
      {id: "map1", src:"img/hi-res-denver-1.jpg"}, 
    ]);

  //preload.loadFile({id: "background", src:"images/background.jpg"});
  for (var i=0; i < mapResourceObj.length; i++) {
    preload.loadFile(mapResourceObj[i]);
  }
  
  stage.update();
  
}

function handleLoadingProgress(){ 
  //changing the length of our loadingBar accordingly
  loadingBar.loadingBar.scaleX = preload.progress * loadingBar.width;
  
  //and the percentage in the loading label
  progresPrecentage = Math.round(preload.progress*100);
  loadProgressLabel.text = progresPrecentage + "% Loaded" ;
  
  //updating the stage to draw the changes
  stage.update();
}

function handleLoadingComplete() { 
  mapImage1               = preload.getResult("map1");
  airliftImage            = preload.getResult("airlift"); 
  ambulanceImage          = preload.getResult("ambulance");
  fireresponseImage       = preload.getResult("fireresponse");
  hazmatImage             = preload.getResult("hazmat");
  utilitiesresponseImage  = preload.getResult("utilitiesresponse");
  loadProgressLabel.text = "Loading Complete \nClick To Start";
  stage.update();
  canvas.addEventListener("click", handleStartClick);
 }

function handleStartClick() {  
  start();
  stage.removeChild(loadingBar, loadProgressLabel);  
  canvas.removeEventListener("click", handleStartClick);
  stage.update();
}

function start() { 
  createjs.Touch.enable(stage); 
  mapScale = 1;
  map = new Map(mapImage1); 
  stage.addChild(map);

  // send request for socket.io initialization   
  socket.emit('socketClientSender_initializeNodeServer', userName, function () { 
    console.log('execute: socketClientSender_initializeNodeServer...');
  });

  // listen for initialization response
  socket.on('socketClientReciever_initializeNodeServer', function (resources) { 
    if (newUser) {
      newUser = false;
      for (var resource in resources) { 
        var newMapResource_obj = resources[resource]; 
        var newMapResourceId = document.getElementById(newMapResource_obj.domElementId); 
        var newMapResourceImage = preload.getResult( newMapResourceId.id ); 
        var newMapResource = new MapResource(newMapResourceImage); 
        var resourcePoint; 
        map.addChild(newMapResource);
        newMapResource.name = newMapResource_obj.name;
        resourcePoint = new createjs.Point(newMapResource_obj.x, newMapResource_obj.y);
        newMapResource.x = resourcePoint.x;
        newMapResource.y = resourcePoint.y;
        console.log(newMapResource_obj); 
      }
      createjs.Ticker.addListener(stage);
      stage.update(); 
    }
  });
}




function addMapElement(resource, sender, name) { 
  var newMapResourceImage = preload.getResult( resource.id ); 
  var newMapResource = new MapResource(newMapResourceImage);
  var resourcePoint = map.globalToLocal( canvas.width/2, canvas.height/2 ); 
  map.addChild(newMapResource);
  
  if (name == '') { 
    newMapResource.name = 'mapResource_'+new Date().getTime(); 
  } else { 
    newMapResource.name = name; 
  }

  newMapResource.x = resourcePoint.x;
  newMapResource.y = resourcePoint.y;

  if (sender) {
    var newSockectMapResource = {
      sender:true, 
      id:newMapResource.id, 
      name: newMapResource.name, 
      domElementId: resource.id, 
      x:newMapResource.x, 
      y:newMapResource.y
    }
    socket.emit('socketClientSender_addMapElement', newSockectMapResource, function () { 
      console.log('socket emit: socketClientSender_addMapElement'); 
    });
  }
};











