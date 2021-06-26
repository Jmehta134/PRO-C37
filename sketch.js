var dogimg,dog,happydog,database,foods,foodstock;
var feed , addfood;
var fedTime, lastFed;
var foodObj;
var namebox,dogname,button;
var changestate,readstate;
var bedroom,garden,washroom;
var gameState;
var dogi;
function preload()
{
	dogimg = loadImage("images/dogImg.png");
  happydog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(400, 500);
  database = firebase.database();
  foodstock = database.ref('food');
  foodstock.on("value",readStock);
  
  foodObj = new Food();

  //buttons
  feed = createButton("feed the Dog");
  feed.position(550,60);
  feed.mousePressed(feedDog);

  addfood = createButton("add Food");
  addfood.position(650,60);
  addfood.mousePressed(addFood);

  //Dog
  dog = createSprite(200,height-height/4,50,50);
  dog.addImage(dogimg);
  dog.scale=0.2;
  
  //reading gamestate 
  readstate=database.ref('gamestate');
  readstate.on("value",(data)=>{
    gameState = data.val()
  })

  dogi =0;
}


function draw() {  
  background(46, 139, 87);
  drawSprites();
  textSize(20);
  fill(255);
  stroke(0);
  text("food remaining :"+foods,50,100);
  database.ref('hour').on("value",function(data){
    lastFed = data.val();
  })
  if (lastFed>12){
    text("last fed : "+ lastFed%12 +"PM",50,30);
  }else if (lastFed === 12){
    text("last fed : 12 AM",50,30);
  }else{
    text("last fed : "+ lastFed+ "AM",50,30);
  }
  if (gameState != "hungry" && gameState != undefined){
    feed.hide();
    addfood.hide();
    dog.remove();
  }else{
    feed.show();
    addfood.show();
    dog.addImage(dogimg);
    if (dogi === 1){dog.addImage(happydog);}
  }
  
  currentTime = hour();
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
    feed.hide();
    addfood.hide();
  } else if (currentTime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
    feed.hide();
    addfood.hide();
  } else if (currentTime>(lastFed+2)&&currentTime<(lastFed+4)){
    update("bathing");
    foodObj.washroom();
    feed.hide();
    addfood.hide();
  } else{
    update("hungry");
    foodObj.display();
  }
}
// read values from DB
function readStock(data){
  foods = data.val();
}/*
// write values in DB
function writeStock(x){
  database.ref('/').update({
    food:x-1
  })
}*/
//function to feed Dog i.e, remove food
function feedDog(){
  if (foods > 0){
    foods=foods-1;
    foodObj.updateFoodStock();
    //writeStock(foods);
    dog.addImage(happydog);
    foodObj.fedImg = true;
    dogi = 1;
  }
}
// function to add food 
function addFood(){
  database.ref('/').update({
    food:foods+1
  });
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
