var database ,dog,dog1,dog2
var position
var feed,add
var foodobject
var Feedtime
var lastFeed
var gameState=0
var bedRoomImg, deadDogImg, dogImg, dogVaccinationImg, foodStockImg, gardenImg;
var happyDogImg,injectionImg, lazyImg, livingRoomImg;
var milkImg, runningImg, runningLeftImg, vaccinationImg, washRoomImg;


function preload()

{
  bedRoomImg = loadImage("Bed Room.png")
  deadDogImg = loadImage("deadDog.png")
  dogImg = loadImage("Dog.png")
  dogVaccinationImg = loadImage("dogVaccination.png")
 foodStockImg = loadImage("Food Stock.png")
gardenImg = loadImage("Garden.png")
happyDogImg = loadImage("happy dog.png")
injectionImg = loadImage("Injection.png")
lazyImg = loadImage("Lazy.png")
livingRoomImg = loadImage("Living Room.png")
milkImg = loadImage("milk.png")
runningImg = loadImage("running.png")
runningLeftImg = loadImage("runningLeft.png")
vaccinationImg = loadImage("dogVaccination.png")
washRoomImg = loadImage("Wash Room.png")
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodobject=new Food
  dog1 = createSprite(550,250,10,10);
  dog1.addImage(happyDogImg)
  dog1.scale=0.2
  
  dog2=createSprite(550,250,10,10)
  dog2.addImage(dogImg)
dog2.scale=0.2;

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });

 

  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);
feed = createButton("FEED THE DOG")
feed.position(880, 65)
feed.mousePressed(FeedDog)

add = createButton("ADD FOOD")
add.position(1000, 65)
add.mousePressed(AddFood)

} 



function draw(){
 { background(46,139,87);
 foodobject.display()
 feedTime=database.ref('FeedTime');
 feedTime.on("value", function(data){
   lastFeed=data.val();
 })

 if(gameState!=="Hungry") {
   feed.hide();
   add.hide();
   dog1.remove();
   

 }else{
   feed.show();
   add.show();
   dog1.addImage(deadDogImg);
   
   
 }
 
 }
 drawSprites();
  
  fill(255,255,254);
 textSize(15);
 if(lastFeed>=12) {
   text("Last Feed :"+ lastFeed%12 + "PM", 350, 30);
 }else if(lastFeed==0) {
   text("LastFeed :12 AM", 350, 30);
 }else{
   text("Last Feed: "+lastFeed + "AM", 350, 30);
 }

  currentTime=hour();
  if(currentTime===(lastFeed+1)) {
    update("Playing");
    foodobject.garden();
  }else if(currentTime===(lastFeed+2)) {
    update("Sleeping");
    foodobject.bedroom();
  }else if(currentTime>(lastFeed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodobject.washroom();
  }else{
    update("Hungry")
    foodobject.display();
  }
drawSprites();
}
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
  
  
}

function showError(){
  console.log("Error in writing to the database");
}

function writePosition(data){
  if(data>0){
    data=data-1
  }
  else{
    data=0
  }
  database.ref('/').set({
    'Food': data
  })

}
function AddFood(){
position++
database.ref('/').update({
  Food:position
}

)
}
function FeedDog(){
  gameState="Hungry"
dog2.addImage(happyDogImg)
  foodobject.updateFoodStock(foodobject.getFoodStock()-1)
   database.ref('/').update({
     Food:foodobject.getFoodStock(),
     FeedTime:hour ()

   
   })
 
  }
function update(state) {
  database.ref('/').update({
    gameState:state
  }) 

  
}