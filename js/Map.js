/*
 * Class: Map
 * Description: Encapsulates the map and container functionality. 
 * Author: Fritz Padilla III
 * Date: 08.30.2013
 *  
 */ 



(function () {

  var Map = function(bitmapElement) {
    this.initialize(bitmapElement);
  };
  
  
  //Map will inherit from the Container class
  Map.prototype = new createjs.Container();
  
  
  //saving the old initialize function of the container class cause we are overwriting it
  //we will call the container initialize function in our own initialize
  Map.prototype.Container_initialize = Map.prototype.initialize;
  
  
  //the initialize function for our Map class
  Map.prototype.initialize = function(bitmapElement) { 
    
    //calling the saved initialize function of the Container class
    this.Container_initialize();

    this.map = new createjs.Bitmap(bitmapElement); 
    
    this.addChild(this.map);
   

    this.name="the_map"; 
    
  };
  
  window.Map = Map;
  
  
  
  
  
  Map.prototype.moveMap = function(direction) {
    console.log("This function will move the map " + direction); 
  }; 


  var zoom;
  


  //Map.prototype.zoom = function(_MAPSCALE) { 
    //this.scaleX = this.scaleY = _MAPSCALE;

Map.prototype.zoom = function(e) { 
  
  var canvasWidth, canvasHeight; 
  if (this.parent.canvas.width !== undefined ) {
    canvasWidth = this.parent.canvas.width; 
  } else { 
    canvasWidth = 960; 
  }

  if (this.parent.canvas.height !== undefined ) {
    canvasHeight = this.parent.canvas.height; 
  } else {
    canvasHeight = 460; 
  }
  
  
  //if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
  if(e.id == "zoomIn")
    zoom=1.1;
  else
    zoom=1/1.1;

  stage.regX=canvasWidth/2;
  stage.regY=canvasHeight/2;
  stage.x=canvasWidth/2;
  stage.y=canvasHeight/2; 
  
  stage.scaleX=stage.scaleY*=zoom;

  //Communication the zooming and panning of the map with socket.io
  //Revisit later.  More important to be able to communicate the addition of map resources. 
  /*socket.on('serverSocketZoomIn', function (e) { 
    console.log('socket function: server socketZoomIn: ' + e); 
    //stage.scaleX=stage.scaleY*=zoom;
  });
  
  socket.emit('clientSocketZoomIn', e, function () { 
    console.log('socket function: client clientSocketZoomIn' + e); 
  }); 
  */
  
  stage.update();

  }; 
  
  
    
  
  
  
  
  
  
}());
