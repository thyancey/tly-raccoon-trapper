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


/*
stats = {
  speed: [ minSpeedX, maxSpeedX ]
}
*/

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'newRaccoon');

    // this.status = STATUS.ROAMING;
    // this.love = 0;
    // this.maxLove = 100;
    this.stats = spawnData.stats || {};
    this.status = null;
    this.isFull = false;

    //- custom properties
    this.isAlive = true;

    //- parent stuff
    this.setDepth(spawnData.depth);
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
    this.body.setSize(30,20);
    this.body.offset.x = 15;
    this.body.offset.y = 25;
    this.setStatus(STATUS.ROAMING, true);

    //- interaction listeners
    this.setInteractive();
    this.on('pointerdown', (thing) => {
      this.kill();
    });
  }

  canEat(){
    if(this.isAlive){
      switch(this.status){
        case STATUS.ROAMING: return true
        case STATUS.IDLE: return true
        case STATUS.HOPPING_START: return true
        case STATUS.HOPPING: return true
        case STATUS.HOPPING_END: return true
        default: return false;
      }
    }else{
      return false;
    }
  }

  canHop(){
    if(this.isAlive && this.body.touching.down){
      switch(this.status){
        case STATUS.ROAMING: return true
        case STATUS.IDLE: return true
        case STATUS.TAME: return true
        default: return false;
      }
    }else{
      return false;
    }
  }
  
  canIdle(){
    if(this.isAlive && this.body.touching.down && this.body.velocity.x === 0){
      switch(this.status){
        case STATUS.ROAMING: return true
        case STATUS.IDLE: return true
        default: return false;
      }
    }else{
      return false;
    }
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

    const didHop = this.handleHopping();
    if(!didHop){
      if(this.canIdle()) this.setStatus(STATUS.IDLE);
    }
  }

  handleHopping(){
    if(this.checkStatus('HOPPING')){
      // console.log("vel", this.body.velocity)
      if(this.body.velocity.y > 40){
        this.anims.play('newRaccoon_hop_down');
        this.setVelocityX(150); // this lil boost helps it get over barriers
        return true;
      }else if(this.body.velocity.y < -40){
        this.anims.play('newRaccoon_hop_up');
        return true;
      }else if(this.body.velocity.y === 0){
        this.setStatus(STATUS.HOPPING_END);
        return true;
      }
    }
    else if(this.canHop()){
      //touching ground
      if((Math.random() * 1000) < this.stats.jumpRate){
        this.hopForward();
        return true;
      }
    }

    return false;
  }

  //- if 
  touched(otherBody){
    // console.log('touched')
    if(this.canEat()){
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
      this.status = status;

      switch(this.status){
        case STATUS.ROAMING: 
          this.goNormalSpeed();
          break;
        case STATUS.TAME: 
          this.isFull = true;
          this.body.setDrag(0);
          this.goNormalSpeed(.6);
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
            if(this.isFull){
              this.setStatus(STATUS.TAME);
            }else{
              this.setStatus(STATUS.ROAMING);
            }
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

    global.setTimeout(() => {
      this.isAlive = false;
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
      { key: 'newRaccoon', frame: 0 },  
      { key: 'newRaccoon', frame: 1 } 
    ],
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_walk',
    frames: [ 
      { key: 'newRaccoon', frame: 2 },  
      { key: 'newRaccoon', frame: 3 } 
    ],
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hop_start',
    frames: [ { key: 'newRaccoon', frame: 4 } ],
    // frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 5, end: 7 }),
    frameRate: 7,
    repeat: 0
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hop_up',
    frames: [ { key: 'newRaccoon', frame: 5 } ],
    frameRate: 7,
    repeat: 0
  });
  
  sceneContext.anims.create({
    key: 'newRaccoon_hop_down',
    frames: [ { key: 'newRaccoon', frame: 6 } ],
    frameRate: 7,
    repeat: 0
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hop_end',
    frames: [ { key: 'newRaccoon', frame: 7 } ],
    frameRate: 7,
    repeat: 0
  });
  
  sceneContext.anims.create({
    key: 'newRaccoon_angryWalk',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 2, end: 3 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 10, end: 11 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_dead',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 14, end: 15 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_eat',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 8, end: 9 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'newRaccoon_hug',
    frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 12, end: 13 }),
    frameRate: 7,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  const spr = sceneContext.load.spritesheet('newRaccoon', img_newRaccoon, { frameWidth: 56, frameHeight: 56 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}