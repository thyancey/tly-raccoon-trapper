import Phaser from 'phaser';
import img_player from '../assets/entity-oldlady.png';
import img_statBar from '../assets/statbar.png';
import { getDepthOfLane } from '../utils/values';

const KILL_TIMEOUT = 5000;
const KICK_RECOVERY = 250;

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
    this.kickCharge = 0;

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
    scene.input.keyboard.on('keyup', this.onKeyUp.bind(this));
  }

  onKeyUp(e){
    switch(e.code){
      // case 'ArrowDown': this.changeLane(1);
      // break;
      // case 'ArrowUp': this.changeLane(-1);
      //   break;
      case 'ArrowRight': this.kick();
        break;
      // case 'ArrowLeft': this.setStatus(STATUS.HUG_PREP);
      //   break;
    }
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

  killRecoveryTimer(){
    if(this.recoveryTimer);
    window.clearTimeout(this.recoveryTimer);
    this.recoveryTimer = null;
  }

  checkStatus(statusKey){
    // console.log('check', statusKey, this.status, STATUS[statusKey])
    return this.status === statusKey;
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

  chargeKick(){
    this.kickCharge += .1;
    if(this.kickCharge > 1){
      this.kickCharge = 1;
    }
  }

  kick(){
    this.setStatus(STATUS.KICK);
    this.kickCharge = 0;
    
    this.startRecoveryTimer(() => {
      this.setStatus(STATUS.IDLE);
    }, 500);
  }

  //- eventually this should be % charge * stats
  getKickStrength(){
    return this.kickCharge;
  }

  hug(enemy){
    if(this.isAlive){
      this.setStatus(STATUS.HUG);
      
      this.startRecoveryTimer(() => {
        this.setStatus(STATUS.IDLE);
      }, KICK_RECOVERY;
    }
  }

  update(){
  }
  
  throttledUpdate(){
    if(this.checkStatus(STATUS.KICK_PREP)){
      this.chargeKick();
    }
  }


  playAnimationForStatus(){
    const animKey = animationStatus[this.status];
    if(animKey){
      this.anims.play(animKey);
    }
  }

  setStatus(status, force, playStatusAnimation = true){
    // console.log('setStatus', status);
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


  sceneContext.anims.create({
    key: 'statBar_0',
    frames: [ { key: 'statBar', frame: 0 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'statBar_0',
    frames: [ { key: 'statBar', frame: 0 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'statBar_1',
    frames: [ { key: 'statBar', frame: 1 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'statBar_2',
    frames: [ { key: 'statBar', frame: 2 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'statBar_3',
    frames: [ { key: 'statBar', frame: 3 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'statBar_4',
    frames: [ { key: 'statBar', frame: 4 } ],
    frameRate: 0,
    repeat: -1
  });
  sceneContext.anims.create({
    key: 'statBar_5',
    frames: [ { key: 'statBar', frame: 5 } ],
    frameRate: 0,
    repeat: -1
  });
  sceneContext.anims.create({
    key: 'statBar_6',
    frames: [ { key: 'statBar', frame: 6 } ],
    frameRate: 0,
    repeat: -1
  });
  sceneContext.anims.create({
    key: 'statBar_7',
    frames: [ { key: 'statBar', frame: 7 } ],
    frameRate: 0,
    repeat: -1
  });
  sceneContext.anims.create({
    key: 'statBar_8',
    frames: [ { key: 'statBar', frame: 8 } ],
    frameRate: 0,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('player', img_player, { frameWidth: 64, frameHeight: 88 });

  sceneContext.load.spritesheet('statBar', img_statBar, { frameWidth: 45, frameHeight: 10 } )
}

export default {
  Entity,
  initSprites,
  initSpritesheet,
}