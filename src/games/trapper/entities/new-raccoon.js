import Phaser from "phaser";
import img_newRaccoon from "../assets/new-raccoon.png";

const KILL_TIMEOUT = 5000;

export const STATUS = {
  ROAMING: 0,
  EATING: 1,
  ANGRY: 2,
  TAME: 3,
  DEAD: 4,
  HUG: 5,
  IDLE: 6,
  HOPPING: 7,
  HOPPING_START: 8,
  HOPPING_END: 9,
}

const animationStatus = {
  [STATUS.IDLE]: 'newRaccoon_idle',
  [STATUS.ROAMING]: 'newRaccoon_walk',
  [STATUS.HOPPING_START]: 'newRaccoon_hop_start',
  [STATUS.HOPPING]: 'newRaccoon_hop',
  [STATUS.HOPPING_END]: 'newRaccoon_hop_end',
  [STATUS.EATING]: 'newRaccoon_eat',
  [STATUS.ANGRY]: 'newRaccoon_walk',
  [STATUS.TAME]: 'newRaccoon_loveWalk',
  [STATUS.DEAD]: 'newRaccoon_dead',
  [STATUS.HUG]: 'newRaccoon_hug'
}

const canEat = status => {
  switch(status){
    case STATUS.ROAMING: return true
    case STATUS.IDLE: return true
    case STATUS.HOPPING_START: return true
    case STATUS.HOPPING_END: return true
    default: return false;
  }
}

/*
stats = {
  speed: [ minSpeedX, maxSpeedX ]
}
*/

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup, stats = {}) {
    super(scene, x, y, 'newRaccoon');


    // this.status = STATUS.ROAMING;
    this.love = 0;
    this.maxLove = 100;
    this.prevStatus = null;
    this.stats = stats;

    //- custom properties
    this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }
    
    //- physics
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(25,40);
    this.body.offset.x = 15;
    this.body.offset.y = 7;
    this.setStatus(STATUS.ROAMING, true);

    //- interaction listeners
    this.setInteractive();
    this.on('pointerdown', (thing) => {
      this.kill();
    });
  }

  kill(){
    this.setStatus(STATUS.DEAD);
    this.body.setDrag(500);
    this.isAlive = false;

    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT)
  }

  update(){
    //- turn if facing left
    if(this.flipX){
      if(this.body.velocity.x >= 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }

    this.handleHopping();
  }

  handleHopping(){
    if(this.checkStatus('HOPPING')){
      // console.log("vel", this.body.velocity)
      if(this.body.velocity.y > 40){
        this.anims.play('newRaccoon_hop_down');
      }else if(this.body.velocity.y < -40){
        this.anims.play('newRaccoon_hop_up');
      }else if(this.body.velocity.y === 0){
        this.setStatus(STATUS.HOPPING_END);
      }
    }
    else if(this.isAlive && this.status === STATUS.ROAMING && this.body.touching.down){
      //touching ground
      if((Math.random() * 1000) < this.stats.jumpRate){
        this.hopForward();
      }
    }
  }

  //- if 
  touched(otherBody){
    // console.log('touched')
    if(canEat(this.status)){
      this.setStatus(STATUS.EATING);
      this.body.x = otherBody.x;
    }
  }

  bowlEmpty(){
    if(this.isAlive){
      this.setStatus(STATUS.TAME);
    }
  }

  playAnimationForStatus(){
    const animKey = animationStatus[this.status];
    if(animKey){
      this.anims.play(animKey);
    }
  }

  checkStatus(statusKey){
    return this.status === STATUS[statusKey];
  }

  goNormalSpeed(modifier = 1){
    this.body.setDrag(0);
    // this.body.velocity.x = 10; 
    this.body.velocity.x = this.stats.speed * modifier;
  }

  setStatus(status, force, playStatusAnimation = true){
    if(force || this.status !== status){
      this.prevStatus = this.status;
      this.status = status;

      switch(this.status){
        case STATUS.ROAMING: 
          this.goNormalSpeed();
          break;
        case STATUS.TAME: 
          this.body.setDrag(0);
          this.goNormalSpeed(1.2);
          break;
        case STATUS.EATING: 
          this.body.setDrag(500);
          break;
        case STATUS.HOPPING_START: 
          this.body.setDrag(500);

          window.setTimeout(() => {
            this.setStatus(STATUS.HOPPING, false, false);
          }, 500);
          break;
        case STATUS.HOPPING: 
          // HOP!
          this.body.setDrag(200);
          this.setVelocityY(-200);
          this.setVelocityX(150);
          break;
        case STATUS.HOPPING_END: 
          this.body.setDrag(500);

          window.setTimeout(() => {
            this.setStatus(STATUS.ROAMING);
          }, 200);
          break;
      }
      if(playStatusAnimation) this.playAnimationForStatus();
    }
  }

  escape(){

  }
  
  hug(){
    this.setStatus(STATUS.HUG);
    this.body.setDrag(500);
    this.isAlive = false;

    global.setTimeout(() => {
      this.destroy();
    }, 1000);
  }
  
  hopForward(){
    this.setStatus(STATUS.HOPPING_START);
  }
}

const initSprites = (sceneContext) => {
  
  sceneContext.anims.create({
    key: 'newRaccoon_idle',
    frames: [ 
      { key: 'newRaccoon', frame: 4 },  
      { key: 'newRaccoon', frame: 5 } 
    ],
    frameRate: 3,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_walk',
    frames: [ 
      { key: 'newRaccoon', frame: 4 },  
      { key: 'newRaccoon', frame: 5 } 
    ],
    frameRate: 3,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hop_start',
    frames: [ { key: 'newRaccoon', frame: 6 } ],
    // frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 5, end: 7 }),
    frameRate: 5,
    repeat: 0
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hop_up',
    frames: [ { key: 'newRaccoon', frame: 7 } ],
    frameRate: 10
  });
  
  sceneContext.anims.create({
    key: 'newRaccoon_hop_down',
    frames: [ { key: 'newRaccoon', frame: 8 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hop_end',
    frames: [ { key: 'newRaccoon', frame: 9 } ],
    // frames: [ 
    //   { key: 'newRaccoon', frame: 8 },
    //   { key: 'newRaccoon', frame: 9 },
    //   { key: 'newRaccoon', frame: 5 } 
    // ],
    frameRate: 5,
    repeat: 0
  });

  sceneContext.anims.create({
    key: 'newRaccoon_jump',
    frames: [ { key: 'newRaccoon', frame: 7 } ],
    frameRate: 10
  });
  
  sceneContext.anims.create({
    key: 'newRaccoon_fall',
    frames: [ { key: 'newRaccoon', frame: 8 } ],
    frameRate: 10
  });


  sceneContext.anims.create({
    key: 'newRaccoon_angryWalk',
    frames: [ { key: 'newRaccoon', frame: 9 },  { key: 'newRaccoon', frame: 12 } ],
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 0, end: 1 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_dead',
    frames: [ { key: 'newRaccoon', frame: 15 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'newRaccoon_eat',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 10, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hug',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 2, end: 3 }),
    frameRate: 5,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('newRaccoon', img_newRaccoon, { frameWidth: 56, frameHeight: 56 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}