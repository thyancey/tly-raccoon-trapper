import Phaser from 'phaser';

const KILL_TIMEOUT = 5000;

export const STATUS = {
  ROAMING: 0,
  EATING: 1,
  ROAMING_TAME: 3,
  DEAD: 4,
  HUGGING: 5,
  IDLE: 6,
  ROAMING_ANGRY: 11,
  CAPTURED: 12,
  ESCAPED: 13
}

const spriteKey = 'raccoon';
const velocityRanges = {
  LIL_PUNT: {
    min: { x: -75, y: -50 },
    max: { x: -200, y: -200 },
    diff: { x: 0, y: 0 }
  },
  BIG_PUNT: {
    min: { x: -500, y: -300 },
    max: { x: -700, y: -500 },
    diff: { x: 0, y: 0 }
  }
}

velocityRanges.LIL_PUNT.diff = {
  x: velocityRanges.LIL_PUNT.max.x - velocityRanges.LIL_PUNT.min.x,
  y: velocityRanges.LIL_PUNT.max.y - velocityRanges.LIL_PUNT.min.y
};
velocityRanges.BIG_PUNT.diff = {
  x: velocityRanges.BIG_PUNT.max.x - velocityRanges.BIG_PUNT.min.x,
  y: velocityRanges.BIG_PUNT.max.y - velocityRanges.BIG_PUNT.min.y
};

/*
stats = {
  speed: [ minSpeedX, maxSpeedX ]
}
*/
class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'raccoon');

    // this.status = STATUS.ROAMING;
    // this.love = 0;
    // this.maxLove = 100;
    this.stats = spawnData.stats || {};
    this.status = null;
    this.isFull = false;

    // move bowl to the right, relative to entity
    this.eatOffset = 11;

    this.curPhysState = null;
    this.curAnimState = null;

    this.puntKillThreshold = 1;
    if(spawnData.misc?.puntKillThreshold || spawnData.misc?.puntKillThreshold === 0){
      this.puntKillThreshold = spawnData.misc.puntKillThreshold;
    }

    this.feedable = true;
    if(spawnData.misc?.feedable === false){
      this.feedable = false;
    }

    //- parent stuff
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }
    
    //- physics
    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(30,20);
    this.body.offset.x = 15;
    this.body.offset.y = 25;
    this.setStatus(STATUS.ROAMING, true);

    //- interaction listeners
    this.setInteractive();
    if(spawnData.misc?.tint){
      this.setTint(spawnData.misc.tint);
    }
    this.on('pointerdown', (thing) => {
      this.kill();
    });
  }

  canEat(){
    if(this.isAlive() && this.feedable && !this.isFull){
      switch(this.status){
        case STATUS.EATING: return false;
        default: return true;
      }
    }else{
      return false;
    }
  }
  
  canIdle(){
    if(this.isAlive() && this.body.touching.down && this.body.velocity.x === 0){
      switch(this.status){
        case STATUS.ROAMING: return true;
        case STATUS.IDLE: return true;
        default: return false;
      }
    }else{
      return false;
    }
  }

  // right now, its a %, later should be actual power
  punt(force){
    // console.log('force', force)
    this.body.setDrag(0);

    let vRange;
    if(force < .5){
      vRange = velocityRanges.LIL_PUNT;
    }else{
      vRange = velocityRanges.BIG_PUNT;
    }

    // console.log('vRange', vRange.min.x + vRange.diff.x * force)
    this.setVelocity(
      vRange.min.x + vRange.diff.x * force,
      vRange.min.y + vRange.diff.y * force,
    );

    if(force >= this.puntKillThreshold){
      this.kill();
      return true;
    }
    return false;
  }

  kill(){
    this.setStatus(STATUS.DEAD);

    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT)
  }

  update(){
    //- turn if facing left
    if(this.isAlive() && this.flipX){
      if(this.body.velocity.x >= 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }

    const animKey = this.getAnimationForState();
    if(animKey !== this.curAnim){
      this.curAnim = animKey;
      this.playAnimationForKey(animKey);
    }
    
    this.adjustMovementForState();
  }

  isAlive(){
    return this.status !== STATUS.DEAD;
  }

  isMovingStatus(given){
    switch (given || this.status){
      case STATUS.ROAMING: return true;
      case STATUS.ROAMING_ANGRY: return true;
      case STATUS.ROAMING_TAME: return true;
      default: break;
    }
    return false;
  }

  adjustMovementForState(){
    if(this.body.velocity.x < 1 && this.body.velocity.x > -1){
      //- if still, but in a moving status (most likely after falling), force it again to get movin!
      if(this.isMovingStatus(this.status)){
        this.setStatus(this.status, true);
      };
    }

    //- attempt to readjust after landing from a punt
    if(this.body.touching.down && this.body.velocity.x < 0){
      this.moveStop();
    }
  }

  getAnimationForState(){
    if(this.status === STATUS.DEAD){
      return 'raccoon_dead';
    } else {
      if (this.body.velocity.y < -50) {
        return 'raccoon_hop_up';
      } else if (this.body.velocity.y > 50) {
        return 'raccoon_hop_down';
      } else if (this.status === STATUS.EATING){
        return 'raccoon_eat';
      } else if (this.status === STATUS.ROAMING_TAME){
        return 'raccoon_loveWalk';
      } else if (this.status === STATUS.ROAMING_ANGRY){
        return 'raccoon_angryWalk';
      } else if (this.status === STATUS.ROAMING){
        return 'raccoon_walk';
      }
    }

    return null;
  }

  setPhysState(){
    const physState = null;


    if(physState && physState !== this.curPhysState){

    }
  }

  throttledUpdate(){

  }
  
  eatAtBowl(bowlBody){
    // align with the food bowl
    this.body.x = bowlBody.x - this.eatOffset;

    this.setStatus(STATUS.EATING);
  }

  bowlEmpty(){
    if(this.isAlive()){
      this.isFull = true;
      this.setStatus(STATUS.ROAMING_TAME);
    }
  }

  playAnimationForKey(animKey){
    if(animKey){
      this.anims.play(animKey);
    }
  }

  checkStatus(statusKey){
    return this.status === statusKey;
  }

  moveNormal(modifier = 1){
    this.body.setDrag(0);
    // this.body.velocity.x = 10; 
    this.body.velocity.x = this.stats.speed * modifier;
  }

  moveStop(){
    this.body.setDrag(500);
  }


  setStatus(status, force, playStatusAnimation = true){
    if(force || this.status !== status){
      this.status = status;

      switch(this.status){
        case STATUS.ROAMING: 
          this.moveNormal();
          break;
        case STATUS.ROAMING_TAME: 
          this.moveNormal(3);
          break;
        case STATUS.EATING: 
          this.moveStop();
          break;
        case STATUS.DEAD:
          this.moveStop();
          break;
        case STATUS.HUGGING: 
          this.moveStop();
          break;
        case STATUS.CAPTURED: 
          this.moveStop();
          break;
        default: break;
      }
    }
  }

  // assumeStatus(){
  //   if(this.isAlive()){
  //     if(this.isFull){
  //       return STATUS.ROAMING_TAME;
  //     }else{
  //       if(this.canIdle()){
  //         return STATUS.IDLE;
  //       }else{
  //         return STATUS.ROAMING;
  //       }
  //     }
  //   }
  // }

  resumeStatus(){
    const statusKey = this.resumeStatus;
    this.setStatus(statusKey)
  }

  escaped(){
    this.setStatus(STATUS.ESCAPED);
    this.delayedDestroy();
  }

  captured(){
    this.setStatus(STATUS.CAPTURED);
    this.delayedDestroy();
  }
  
  hug(){
    this.setStatus(STATUS.HUGGING);
    this.delayedDestroy();
  }

  delayedDestroy(){
    global.setTimeout(() => {
      this.destroy();
    }, 1000);
  }
}

const initSprites = (sceneContext) => {
  
  sceneContext.anims.create({
    key: 'raccoon_idle',
    frames: [ 
      { key: spriteKey, frame: 0 },  
      { key: spriteKey, frame: 1 } 
    ],
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_walk',
    frames: [ 
      { key: spriteKey, frame: 2 },  
      { key: spriteKey, frame: 3 } 
    ],
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_hop_start',
    frames: [ { key: spriteKey, frame: 4 } ],
    frameRate: 7,
    repeat: 0
  });

  sceneContext.anims.create({
    key: 'raccoon_hop_up',
    frames: [ { key: spriteKey, frame: 5 } ],
    frameRate: 7,
    repeat: 0
  });
  
  sceneContext.anims.create({
    key: 'raccoon_hop_down',
    frames: [ { key: spriteKey, frame: 6 } ],
    frameRate: 7,
    repeat: 0
  });

  sceneContext.anims.create({
    key: 'raccoon_hop_end',
    frames: [ { key: spriteKey, frame: 7 } ],
    frameRate: 7,
    repeat: 0
  });
  
  sceneContext.anims.create({
    key: 'raccoon_angryWalk',
    frames: sceneContext.anims.generateFrameNumbers(spriteKey, { start: 2, end: 3 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers(spriteKey, { start: 10, end: 11 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_dead',
    frames: sceneContext.anims.generateFrameNumbers(spriteKey, { start: 14, end: 15 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_eat',
    frames: sceneContext.anims.generateFrameNumbers(spriteKey, { start: 8, end: 9 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_hug',
    frames: sceneContext.anims.generateFrameNumbers(spriteKey, { start: 12, end: 13 }),
    frameRate: 7,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_punted',
    frames: sceneContext.anims.generateFrameNumbers(spriteKey, { start: 2, end: 3 }),
    frameRate: 7,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('raccoon', './assets/raccoon.png', { frameWidth: 56, frameHeight: 56 });
}

const exportMap = {
  Entity,
  initSprites,
  initSpritesheet,
}
export default exportMap; 