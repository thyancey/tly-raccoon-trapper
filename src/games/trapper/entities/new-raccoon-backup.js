import Phaser from "phaser";
import img_newRaccoon from "../assets/new-raccoon.png";

const KILL_TIMEOUT = 5000;

export const STATUS = {
  ROAMING: 0,
  EATING: 1,
  ANGRY: 2,
  TAME: 3,
  DEAD: 4,
  HUG: 5
}

const animationStatus = {
  [STATUS.ROAMING]: 'newRaccoon_walk',
  [STATUS.EATING]: 'newRaccoon_eat',
  [STATUS.ANGRY]: 'newRaccoon_walk',
  [STATUS.TAME]: 'newRaccoon_loveWalk',
  [STATUS.DEAD]: 'newRaccoon_dead',
  [STATUS.HUG]: 'newRaccoon_hug'
}

const animationActivity = {
  'jump': 'newRaccoon_jump',
  'fall': 'newRaccoon_fall'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup) {
    super(scene, x, y, 'newRaccoon');

    // this.status = STATUS.ROAMING;
    this.love = 0;
    this.maxLove = 100;
    this.prevStatus = null;
    this.curActivity = null;

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
    this.setBounce(.4);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(25,40);
    this.body.offset.x = 15;
    this.body.offset.y = 5;
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

    if(this.body.velocity.y > 40){
      this.setActivity('fall');
    }else if(this.body.velocity.y < -40){
      this.setActivity('jump');
    }else{
      this.setActivity(null);
    }

    this.checkForJump(.05);
  }

  checkForJump(chance){
    if(this.isAlive && this.status === STATUS.ROAMING && this.body.touching.down && Math.random() < chance){
      this.jump();
    }
  }

  jump(){
    this.setVelocityY(Math.random() * - 300);
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

  setActivity(activity, force){
    if(force || this.curActivity !== activity){
      this.curActivity = activity;
      if(this.curActivity){
        this.anims.play(animationActivity[activity]);
      }else{
        this.playAnimationForStatus();
      }
    }
  }

  playAnimationForStatus(){
    const animKey = animationStatus[this.status];
    if(animKey){
      // console.log('play', animKey);
      this.anims.play(animKey);
    }
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.prevStatus = this.status;
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
      this.playAnimationForStatus();
    }
  }
}

const initSprites = (sceneContext) => {
  
  sceneContext.anims.create({
    key: 'newRaccoon_walk',
    frames: [ 
      { key: 'newRaccoon', frame: 4 },  
      { key: 'newRaccoon', frame: 5 } 
    ],
    frameRate: 3,
    repeat: -1
  });

  // sceneContext.anims.create({
  //   key: 'newRaccoon_jump',
  //   frames: sceneContext.anims.generateFrameNumbers('newRaccoon', { start: 5, end: 9 }),
  //   frameRate: 5,
  //   repeat: -1
  // });

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