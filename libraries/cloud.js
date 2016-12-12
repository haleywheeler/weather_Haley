 function cloud(cloudCover){


var clouds = (weatherData.clouds.all);

for(var i = 0; i < clouds; i++){
   
   var correlation = 1;
   var bounceSpeed = 0.001;
   var time = (frameCount * bounceSpeed) + (i * correlation);
   var up = map(noise(time),0,1,0,height);
   var size = map(noise(time),0,1,0,50);
   
   
   if(i < clouds){
      randomSeed(i*200);
      noStroke();
      fill(39,26,64,random(230));
      ellipse(random(width),up,size,size);
   }else{
      randomSeed(i*100);
      noStroke();
      ellipse(random(width),random(height),size,size);
      }
   }

}