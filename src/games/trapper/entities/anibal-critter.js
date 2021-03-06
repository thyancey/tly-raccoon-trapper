import Phaser from "phaser";
import img_anibal01 from "../assets/anibal01.png";

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
  [STATUS.ROAMING]: 'anibal01_walk',
  [STATUS.EATING]: 'anibal01_eat',
  [STATUS.ANGRY]: 'anibal01_walk',
  [STATUS.TAME]: 'anibal01_loveWalk',
  [STATUS.DEAD]: 'anibal01_dead',
  [STATUS.HUG]: 'anibal01_hug'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'anibal01');

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
    this.body.setSize(143,138);
    this.body.offset.x = 46;
    this.body.offset.y = 30;
    // this.anims.play('anibal01_walk');
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
    key: 'anibal01_walk',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 12, end: 14 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_angryWalk',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 3, end: 6 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 16, end: 18 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_dead',
    frames: [ { key: 'anibal01', frame: 0 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'anibal01_eat',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_hug',
    frames: [ { key: 'anibal01', frame: 18 },  { key: 'anibal01', frame: 11 } ],
    frameRate: 5,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('anibal01', img_anibal01, { frameWidth: 244, frameHeight: 174 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}