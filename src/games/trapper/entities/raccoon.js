import Phaser from "phaser";
import img_raccoonTest from "../assets/raccoon.png";

const KILL_TIMEOUT = 5000;

export const STATUS = {
  ROAMING: 0,
  EATING: 1,
  ANGRY: 2,
  TAME: 3,
  DEAD: 4,
  hug: 5
}

const animationStatus = {
  [STATUS.ROAMING]: 'raccoonTest_walk',
  [STATUS.EATING]: 'raccoonTest_eat',
  [STATUS.ANGRY]: 'raccoonTest_walk',
  [STATUS.TAME]: 'raccoonTest_loveWalk',
  [STATUS.DEAD]: 'raccoonTest_dead',
  [STATUS.HUG]: 'raccoonTest_hug'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'raccoonTest');

    // this.status = STATUS.ROAMING;
    this.love = 0;
    this.maxLove = 100;

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
    this.setBounce(.4);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(60,70);
    this.body.offset.x = 35;
    this.body.offset.y = 30;
    // this.anims.play('raccoonTest_walk');
    this.setStatus(STATUS.ROAMING, true);

    //- interaction listeners
    this.setInteractive();
    this.on('pointerdown', (thing) => {
      this.kill();
    });
  }

  escape(){

  }

  kill(){
    this.setStatus(STATUS.DEAD);
    this.body.setDrag(500);
    this.isAlive = false;

    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT)
  }
  
  hug(){
    this.setStatus(STATUS.HUG);
    this.body.setDrag(500);
    this.isAlive = false;

    global.setTimeout(() => {
      this.destroy();
    }, 1000);
  }

  update(){
    //- turn if facing left
    if(this.flipX){
      if(this.body.velocity.x > 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }

    this.checkForJump(.05);
  }

  checkForJump(chance){
    if(this.isAlive && this.status === STATUS.ROAMING && this.body.touching.down && Math.random() < chance){
      // this.setVelocityX((1 + Math.random()) * this.body.velocity.x);
      this.setVelocityY(Math.random() * - 300);
    }
  }


  //- if 
  touched(otherBody){
    // console.log('touched')
    if(this.status === STATUS.ROAMING){
      this.setStatus(STATUS.EATING);
    }

    this.body.x = otherBody.x;
  }

  bowlEmpty(){
    if(this.isAlive){
      this.setStatus(STATUS.TAME);
    }
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      switch(this.status){
        case STATUS.TAME: 
          this.body.setDrag(0);
          this.body.velocity.x = 200; 
          break;
        case STATUS.EATING: 
          // this.body.velocity.x = 0; 
          this.body.setDrag(500);
          break;
      }
      const animKey = animationStatus[this.status];
      if(animKey){
        // console.log('play', animKey);
        this.anims.play(animKey);
      }
    }
  }
}


const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'raccoonTest_walk',
    frames: sceneContext.anims.generateFrameNumbers('raccoonTest', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonTest_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers('raccoonTest', { start: 3, end: 4 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonTest_dead',
    frames: [ { key: 'raccoonTest', frame: 2 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'raccoonTest_eat',
    frames: sceneContext.anims.generateFrameNumbers('raccoonTest', { start: 6, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonTest_hug',
    frames: [ { key: 'raccoonTest', frame: 5 },  { key: 'raccoonTest', frame: 8 } ],
    frameRate: 20,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('raccoonTest', img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}