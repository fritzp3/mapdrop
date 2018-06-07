/*
 * Class: Map
 * Description: Encapsulates the map and container functionality. 
 * Author: Fritz Padilla III
 * Date: 08.30.2013
 *  
 */ 



(function () {
  
  
  
  var MapResource = function(bitmapElement) {
    this.initialize(bitmapElement); 
  }; 
  
  
  //MapResource will inherit from the Container class
  MapResource.prototype = new createjs.Container(); 
  
  
  //saving the old initialize function of the container class cause we are overwriting it
  //we will call the container initialize function in our own initialize
  MapResource.prototype.Container_initialize = MapResource.prototype.initialize;
  
  
  //the initialize function for our MapResource class
  MapResource.prototype.initialize = function(bitmapElement) { 
    
    //calling the saved initialize function of the Container class
    this.Container_initialize();

    
    
    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(0,0,0));
    g.beginFill(createjs.Graphics.getRGB(255,0,0));
    g.drawRoundRect(0,0,70, 70, 0);

    var s = new createjs.Shape(g);
    
    this.addChild(s);
    this.mapResource = new createjs.Bitmap(bitmapElement); 
    this.addChild(this.mapResource);
    //this.name="the_resource"; 
    
    
    
    //To Do: This function will cause problems with the drag-and-drop functionality when the map is zoomed in/out (not scaled to 1). 
    this.onPress = function(e)
    { 

      var offset = { x:e.target.x-e.stageX, y:e.target.y-e.stageY };

      e.onMouseMove = function(ev) {
        ev.target.x = ev.stageX+offset.x;
        ev.target.y = ev.stageY+offset.y; 

        socket.emit('socketClientSender_moveMapElement', {
          'sender': true, 
          'x': this.target.x,
          'y': this.target.y,
          'id': this.target.id, 
          'name': this.target.name,  
        });
      };

      /*e.onMouseMove = function(ev) {
        ev.target.x = (ev.stageX*(e.target.scaleX)+(offset.x*(e.target.scaleX/(Math.PI/2))));
        ev.target.y = (ev.stageY*(e.target.scaleY)+(offset.y*(e.target.scaleY/(Math.PI/2))));
      };*/ 

      e.onMouseUp = function(ev) { 
        socket.emit('socketClientSender_dropMapElement', {
          'sender': true, 
          'x': this.target.x,
          'y': this.target.y,
          'id': this.target.id, 
          'name': this.target.name,  
        }); 
      }


    };




    
  };




  
  window.MapResource = MapResource;
  
    
  MapResource.prototype.moveMapResource = function(direction) { 
    console.log("This function will move the MapResource " + direction); 
  }; 
  
  
  MapResource.prototype.activateResource = function() {
    console.log("This function will set this element as ACTIVE"); 
  };
  
  
  MapResource.prototype.deactivateResource = function() {
    console.log("This function will set this element as NOT ACTIVE"); 
  };
  
  
  MapResource.prototype.rescale = function() {
    console.log("This is the rescale function. "); 
  };
  
  
  
  MapResource.prototype.zoomIn = function() {

    if ( stage.scaleX == 1 ) {
      this.scaleX=this.scaleY = 1; 
    } else {
      this.scaleX=this.scaleY *= 1/1.1; 
    }
    

  };


  MapResource.prototype.zoomOut = function() {
    if ( stage.scaleX == 1 ) {
      this.scaleX=this.scaleY = 1; 
    } else {
      this.scaleX=this.scaleY *= 1.1; 
    }
  };



  
  
  

  
  
  
    
  
  
  
  
  
  
}());
