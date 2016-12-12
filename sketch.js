var drawData;
var thisFont;
var centerX;
var centerY;
var mapImage;
var selectionX;
var selectionY;
var mapLocationX = 40;
var mapLocationY = 220;
var mapSizeX = 340;
var mapSizeY = 220;
var clouds,temp,wind,windMag,windDirection;

function preload(){
 thisFont = loadFont("assets/ArchivoNarrow-Bold.otf");
 mapImage = loadImage("map_equi_1.png")

}
function setup() {
  createCanvas(1280, 720);
  angleMode(DEGREES);
  textFont(thisFont);
  textSize(80);
  textAlign(CENTER);

  centerX = width*.7;
  centerY = height/2;


  loadJSON("http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=4cf826e5b55ab126365d97b06be5e0c5&units=imperial", gotData);
}

function gotData(data) {
  //println(data);
  //drawData = data;
  drawData = data;
}



function draw() {
  background(94,235,123);
  //draw the map image according to the map location and size
  image(mapImage,mapLocationX,mapLocationY,mapSizeX,mapSizeY);
  
  //If we have JSON data do the drawing
  
  if(drawData){
    //set the rect and angle mode so I dont have to deal with radians
      rectMode(CORNERS);
      angleMode(DEGREES);
      strokeWeight(1);
      
      //noFill();
      //grab the data out of the JSON 
      clouds = map(drawData.clouds.all,0,100,0,100);
      temp = map(drawData.main.temp,10,90,1,50);
      wind = map(drawData.wind.speed,1,8,0.01,0.1);
      windmag = map(drawData.wind.speed,1,8,2,40);
      windDirection = map(drawData.wind.deg,0,360,0,360);
      
      //draw the clouds
      cloudDraw();
      
      //draw the temperature structures
      noiseCircleStructure(temp,5,10,wind,windmag,10,0,200);

      //draw the type overlay
      
      noStroke();
      fill(240,255,226);
      
      textSize(40);
      text(drawData.name + " "+ drawData.sys.country,centerX,centerY-70);
      text(drawData.wind.speed + " mph",centerX,centerY+40);
      
      
      textSize(80);
      text(drawData.main.temp + " ºF",centerX,centerY);
      push();
         translate(1,height* .1);
         rotate();
         text("Global Weather Data",800,0);
      pop();
      
      stroke(255,240);
      fill(255,100)
      //DRAW THE LOCATION CIRCLE IN THE DRAW FUNCTION!!! UPDATE THE SELECTION VARIABLE IN THE MOUSEPRESSED!!!!!
      ellipse(selectionX,selectionY,20,20);
      
      //if the mouse over the map
      if(mouseX > mapLocationX &&
        mouseX < (mapLocationX + mapSizeX) &&
        mouseY > mapLocationY &&
        mouseY < (mapLocationY + mapSizeY)
        ){
          //draw the crosshair lines
          line(mouseX,mapLocationY,mouseX,mapLocationY+mapSizeY);
          line(mapLocationX,mouseY,mapLocationX + mapSizeX,mouseY);
          textSize(20);
          noStroke();
          fill(255,240);
          //draw the lat and lon coordinates
          text(floor(map(mouseY,mapLocationY,mapLocationY + mapSizeY,90,-90)),mapSizeX+30,mouseY - 4);
          text(floor(map(mouseX,mapLocationX,mapLocationX + mapSizeX,-180,180)),mouseX - 20 ,mapLocationY+20);
        }
  
  }
}


function mousePressed() {
  if(mouseX > mapLocationX &&
    mouseX < (mapLocationX + mapSizeX) &&
    mouseY > mapLocationY &&
    mouseY < (mapLocationY + mapSizeY)
    ){
      //update the selection coordinates
      selectionX = mouseX;
      selectionY = mouseY;
      //grab the JSON based on the new selection
      var lon =  map(selectionX,mapLocationX,mapLocationX + mapSizeX,-180,180);
      var lat = map(selectionY,mapLocationY,mapLocationY + mapSizeY,90,-90);
      var start = "http://api.openweathermap.org/data/2.5/weather?lat="
      var end = "&appid=4cf826e5b55ab126365d97b06be5e0c5&units=imperial"
      var url = start + lat + "&lon=" + lon + end;
      loadJSON(url, gotData);
      }
}

function noiseCircleStructure(_numberOfCircles,_beginningSize,_circleSizeStep,_speed,_noiseSize,_lineBrightness,_startColor,_endColor){
  var numberOfCircles = _numberOfCircles;
      var lineBrightness = _lineBrightness;
      var startColor = _startColor;
      var endColor = _endColor;
      var speed = _speed;

      for(var i = numberOfCircles; i > 0; i--){
        var filler = map(i,0,numberOfCircles,startColor,endColor);
        fill(filler);
        stroke(filler+lineBrightness);
        var noiseWeight = noise(frameCount * speed);
        noiseWeight = map(noiseWeight,0,1,1,3);
        strokeWeight(noiseWeight);
        var sizer = i * _circleSizeStep + _beginningSize;
        noiseCircle(centerX,centerY,sizer,speed * ((i+1)*.01),_noiseSize,60);
      }

}
function noiseCircle(xpos,ypos,radius,Speed,noiseSize,stepSizer){

  beginShape();
      var stepSize = stepSizer;
      var speed = Speed;
      var size = noiseSize;

      //start one before and end on step after bevause the curve vertex requires and extra point on each end.
      // the modulo is in the nois value so the end points get the same noise location as the actual points the overlap.
      for(var i = 0 - stepSize; i <= (360 + stepSize); i += stepSize){

        var posX = cos(i) * radius + xpos;
        var posY = sin(i) * radius + ypos;

        var noiserX = noise(frameCount * speed + ((i%360) * 1000)) * size;
        var noiserY = noise(frameCount * speed * .99 + ((i%360) * 5003)) * size;
        noiserX = map(noiserX,0,size,-size/3,size/2);
        noiserY = map(noiserX,0,size,-size/3,size/2);
        quad(posX + noiserX,posY + noiserY);


        //ellipse(posX + noiserX,posY + noiserY,noiserX,noiserX);
      }
      endShape();



}
//******************* CLOUDS *******************

function cloudDraw() {
  //set some random but keep it the same frame to frame
  randomSeed(temp);
  for(var i = 0; i <= temp; i ++){
        var slowDownRotation = random(5,10) ;
        var angle = random(360) + (frameCount/slowDownRotation) * (wind*3);
        
        var cloudSize = random(10,30);
        var radius = (temp*10);
        var posX = cos(angle) * radius + centerX;
        var posY = sin(angle) * radius + centerY;
        

        var noiserX = noise(frameCount * wind + ((i%360) * 1000)) * windmag;
        var noiserY = noise(frameCount * wind * .99 + ((i%360) * 1003)) * windmag;
        
        

        stroke(random(100,200),random(250));
        strokeWeight(random(1,3));
        fill(210);
        translate();
       
          beginShape();
            curveVertex(centerX,centerY);
            curveVertex(centerX,centerY);
            curveVertex(posX,posY);
            curveVertex(posX,posY);

          endShape();

      var rateAdjust = frameCount/(windmag);
       
       
        noStroke();
        var lineDarkness = random(0,30);
        fill(102,115,225,rateAdjust%lineDarkness);
        push();
        translate(posX,posY);
        rectMode(RADIUS);
        rotate(windDirection);
        rect(0,0,2,2000);
        pop();
      
      //******************* TEMPERATURE *******************
      var speed = 0.0010;
      var correlation = 10;
      var time = (frameCount * speed) + (i * correlation);
      var rotation = map(noise(time),0,1,0,width);
      var tempChange = (drawData.main.temp);
      var posX = width*.7;
      var posY = height/2;
      
      push();
         translate(posX,posY);
         rotate(rotation);
         
         // CONDITIONAL TO CHANGE COLOR BASED ON TEMP
         if(tempChange < 50){
            strokeWeight(2.5);
            stroke(122,217,221);
            line(50,20);
            
            noStroke();
            fill(0,113,115,20);
            triangle(50, 95, 78, 40, 106, 95);
            
         }else{
            stroke(199,120,42);
            line(20,50);
            noStroke();
            fill(224,104,46,20);
            triangle(50, 95, 78, 40, 106, 95);
         }
       pop();
      }
}

//***********************************************************************
function keyTyped() {
  switch (key) {
    case "1":
      loadJSON("http://api.openweathermap.org/data/2.5/weather?q=Melbourne,australia&appid=4cf826e5b55ab126365d97b06be5e0c5&units=imperial", gotData);
      break;
    case "2":
      var lon =  map(mouseX,0,width,-180,180);
      var lat = map(mouseY,0,height,90,-90);
      var start = "http://api.openweathermap.org/data/2.5/weather?lat="
      var end = "&appid=4cf826e5b55ab126365d97b06be5e0c5&units=imperial"
      var url = start + lat + "&lon=" + lon + end;
      loadJSON(url, gotData);
      break;
    case "3":
      loadJSON("http://api.openweathermap.org/data/2.5/weather?q=Wellington,newzealand&appid=4cf826e5b55ab126365d97b06be5e0c5&units=imperial", gotData);
      break;
  }
}