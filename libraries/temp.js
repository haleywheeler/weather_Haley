function tempDraw() {
  //set some random but keep it the same frame to frame
  randomSeed(temp);
  for(var i = 0; i <= temp; i ++){
        var slowDownRotation = random(5,10) ;
        var angle = random(360) + (frameCount/slowDownRotation) * (wind*3);
        
        var tempSize = random(10,30);
        var radius = (temp*10);
        var posX = cos(angle) * radius + centerX;
        var posY = sin(angle) * radius + centerY;
        

        var noiserX = noise(frameCount * wind + ((i%360) * 1000)) * windmag;
        var noiserY = noise(frameCount * wind * .99 + ((i%360) * 1003)) * windmag;
        
        

        stroke(random(100,200),random(250));
        strokeWeight(random(1,3));
        fill(210);
       
          beginShape();
            curveVertex(centerX,centerY);
            curveVertex(centerX,centerY);
            curveVertex(posX,posY);
            curveVertex(posX,posY);

          endShape();

      var rateAdjust = frameCount/(windmag);
       triangle(posX,posY,rateAdjust%tempSize,rateAdjust%tempSize);
       
        noStroke();
        var lineDarkness = random(0,30);
        fill(102,115,225,rateAdjust%lineDarkness);
        push();
        translate(posX,posY);
        rectMode(RADIUS);
        rotate(windDirection);
        rect(0,0,2,2000);
        pop();

      }
}