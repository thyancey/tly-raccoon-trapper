import Phaser from 'phaser';
import img_player from '../assets/entity-oldlady.png';
import { getDepthOfLane } from '../utils/values';

const KILL_TIMEOUT = 5000;

export const STATUS = {
  IDLE: 0,
  FEED: 1,
  HUG_PREP: 2,
  HUG: 3,
  KICK_PREP: 4,
  KICK: 5,
  HURT: 6,
  DEAD: 7
}

const animationStatus = {
  [STATUS.IDLE]: 'player_idle',
  [STATUS.FEED]: 'player_idle',
  [STATUS.HUG_PREP]: 'player_hug_prep',
  [STATUS.HUG]: 'player_hug',
  [STATUS.KICK_PREP]: 'player_kick_prep',
  [STATUS.KICK]: 'player_kick',
  [STATUS.HURT]: 'player_hurt',
  [STATUS.DEAD]: 'player_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup, laneData) {
    super(scene, x, y, 'player');

    this.hpRange = [ 0, 100 ];
    this.hp = this.hpRange[1];
    this.laneIdx = 0;
    this.laneValues = this.parseLaneData(laneData);
    console.log('lv', this.laneValues)
    this.posOffset = [];
    this.spriteOffset = [];

    this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }

    /* tweak settings here when sprite changes size */
    this.setOrigin(0, 0).refreshBody();
    this.body.setSize(50, 75);
    this.posOffset = [ -100, 20 ];

    /* normal phaser way isnt working, so pass this along to offset the sprite a lil */
    this.spriteOffset = [ 12, 6 ];

    this.updatePlayerPosition();
    this.setStatus(STATUS.IDLE, true);
    
    scene.input.keyboard.on('keydown', this.onKeyDown.bind(this));
  }

  onKeyDown(e){
    switch(e.code){
      case 'ArrowDown': this.changeLane(1);
      break;
      case 'ArrowUp': this.changeLane(-1);
        break;
      case 'ArrowRight': this.setStatus(STATUS.KICK_PREP);
        break;
      case 'ArrowLeft': this.setStatus(STATUS.HUG_PREP);
        break;
    }
  }

  setLaneDepth(){
    this.setDepth(getDepthOfLane(this.laneIdx) - 1);
  }

  parseLaneData(laneData){
    return laneData.map(lane => ({
      x: parseInt(lane.x) + parseInt(lane.width) - 10,
      y: parseInt(lane.y) - 110
    }));
  }
  
  changeLane(diff){
    this.laneIdx += diff;
    const maxIdx = this.laneValues.length - 1;
    if(this.laneIdx > maxIdx){
      this.laneIdx = 0;
    }else if(this.laneIdx < 0){
      this.laneIdx = maxIdx;
    }

    this.updatePlayerPosition();
  }

  updatePlayerPosition(){
    const pos = this.laneValues[this.laneIdx];
    const realPos = {
      x: pos.x + this.posOffset[0],
      y: pos.y + this.posOffset[1],
    }
    this.body.x = realPos.x + this.spriteOffset[0];
    this.body.y = realPos.y + this.spriteOffset[1];
    this.setPosition(realPos.x, realPos.y);
    
    this.setLaneDepth();
  }

  startRecoveryTimer(callback, timeout){
    this.killRecoveryTimer();
    this.recoveryTimer = window.setTimeout(() => {
      this.recoveryTimer = null;
      callback();
    }, timeout);
  }

  killRecoveryTimer(){
    if(this.recoveryTimer);
    window.clearTimeout(this.recoveryTimer);
    this.recoveryTimer = null;
  }

  checkStatus(statusKey){
    return this.status === STATUS[statusKey];
  }
  
  hurt(enemy){
    // console.log('hurt')
    this.setStatus(STATUS.HURT);

    this.startRecoveryTimer(() => {
      this.setStatus(STATUS.IDLE);
    }, 1000);
  }
  
  kill(){
    this.setStatus(STATUS.DEAD);

    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT)
  }

  kick(){
    this.setStatus(STATUS.KICK);

    this.startRecoveryTimer(() => {
      this.setStatus(STATUS.IDLE);
    }, 1000);
  }

  hug(enemy){
    if(this.isAlive){
      this.setStatus(STATUS.HUG);
      
      this.startRecoveryTimer(() => {
        this.setStatus(STATUS.IDLE);
      }, 500);
    }
  }

  update(){
  }

  playAnimationForStatus(){
    const animKey = animationStatus[this.status];
    if(animKey){
      this.anims.play(animKey);
    }
  }

  setStatus(status, force, playStatusAnimation = true){
    if(force || this.status !== status){
      this.status = status;

      switch(this.status){
        case STATUS.IDLE: 
          break;
        case STATUS.FEED: 
          break;
        case STATUS.HUG_PREP: 
          break;
        case STATUS.HUG: 
          break;
        case STATUS.KICK_PREP: 
          break;
        case STATUS.KICK: 
          break;
        case STATUS.HURT: 
          break;
        case STATUS.DEAD: 
          this.isAlive = false;
          break;
      }
      // console.log('status:', this.status)
      const animKey = animationStatus[this.status];
      if(animKey){
        // console.log('animKey:', animKey)
        this.anims.play(animKey);
      }

      if(playStatusAnimation) this.playAnimationForStatus();
    }
  }
}

const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'player_idle',
    frames: sceneContext.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
  sceneContext.anims.create({
    key: 'player_hug_prep',
    frames: [ { key: 'player', frame: 2 } ],
    frameRate: 5,
    repeat: 0
  });
  sceneContext.anims.create({
    key: 'player_hug',
    frames: [ { key: 'player', frame: 2 } ],
    frameRate: 5,
    repeat: 0
  });
  sceneContext.anims.create({
    key: 'player_kick_prep',
    frames: [ { key: 'player', frame: 6 } ],
    frameRate: 5,
    repeat: 0
  });
  sceneContext.anims.create({
    key: 'player_kick',
    frames: [ { key: 'player', frame: 7 } ],
    frameRate: 5,
    repeat: -1
  });
  sceneContext.anims.create({
    key: 'player_hurt',
    frames: sceneContext.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
    frameRate: 5,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('player', img_player, { frameWidth: 64, frameHeight: 88 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet,
}