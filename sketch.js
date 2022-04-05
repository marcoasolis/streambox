var PLAY = 1;
var END = 0;
var gameState = PLAY;

var marco, marco_running, marco_collided;
var ground, invisibleGround, groundImage;

var cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  

  
  marco_running = loadAnimation("assets/marco_2.png","assets/marco_1.png");
 
  
  groundImage = loadImage("assets/ground.png");
  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");

  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
 
  marco = createSprite(50,height-70,20,50);
  
  
  marco.addAnimation("running", marco_running);

  marco.setCollider('circle',0,0,200)
  marco.scale = 0.12
 //  marco.debug=true
  
  invisibleGround = createSprite(0,height+25,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height+10,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  marco.depth=ground.depth;
  marco.depth=marco.depth+1;
  
  gameOver = createSprite(width/2,height/2- 100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = .3;

  gameOver.visible = false;
  restart.visible = false;
  
 
   invisibleGround.visible =true

  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //marco.debug = true;
  background("black");
  textSize(20);
  fill("white")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
  
    if(touches.length > 0 || keyDown("SPACE")&&marco.y>windowHeight-250) {
      jumpSound.play();
      marco.velocityY =-10;
      touches = [];
    }
    
    marco.velocityY = marco.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    marco.collide(invisibleGround);

    spawnObstacles();
  
    if(obstaclesGroup.isTouching(marco)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    marco.visible=false;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    marco.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
 

    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.destroyEach();

    
    if(restart.visible===true&&touches.length>0 || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-50,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
             
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = marco.depth;
    marco.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
 
  
  marco.visible=true;
  
  score = 0;
  
}
