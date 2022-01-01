import Phaser from 'phaser';
import { getDepthOfLane } from '../utils/values';
import StatBar from './stat-bar';

const STARTING_LANE = 2;
const KICK_DURATION = 500; // becomes variable based on kick power
const ATTACKED_DURATION = 1000;
const DESTROY_TIMEOUT = 5000;
const MIN_KICK_FORCE = .3;
let statBar;
let sceneRef;

export const STATUS = {
  IDLE: 0,
  FEED: 1,
  HUGGING: 2,
  KICK_PREP: 3,
  KICK: 4,
  ATTACKED: 5,
  DEAD: 6
}

const animationStatus = {
  [STATUS.IDLE]: 'player_idle',
  [STATUS.FEED]: 'player_idle',
  [STATUS.HUGGING]: 'player_hug',
  [STATUS.KICK_PREP]: 'player_kick_prep',
  [STATUS.KICK]: 'player_kick',
  [STATUS.ATTACKED]: 'player_hurt',
  [STATUS.DEAD]: 'player_idle'
}

const gameState = {};

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup, laneData) {
    super(scene, x, y, 'player');
    sceneRef = scene;
    this.recoveryTimer = null;
    this.destroyTimer = null;

    this.hpRange = [ 0, 100 ];
    this.hp = this.hpRange[1];
    this.laneIdx = 0;
    this.laneValues = this.parseLaneData(laneData);
    this.posOffset = [];
    this.spriteOffset = [];
    this.lastIntent = null;

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
    // this.body.setSize(50, 75);
    // this.posOffset = [ 0, 20 ];
    /* normal phaser way isnt working, so pass this along to offset the sprite a lil */
    // this.spriteOffset = [ 12, 6 ];

    this.body.setSize(60, 100);
    this.posOffset = [ -120, 4 ];
    this.spriteOffset = [ 12, 6 ];
    this.setScale(1.3);

    this.updatePlayerPosition();
    this.setStatus(STATUS.IDLE, true);
    
    gameState.cursors = scene.input.keyboard.createCursorKeys();
    
    statBar = new StatBar.Entity(scene, 150, 150);
    this.changeLane(STARTING_LANE);
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
    statBar && statBar.setOffsetPosition(realPos.x, realPos.y);

    // OK to cancel a kick animation, not OK to cancel a charge
    if(this.status === STATUS.KICK){
      this.cancelKick();
    }
    
    this.setLaneDepth();
  }

  checkStatus(statusKey){
    // console.log('check', statusKey, this.status, STATUS[statusKey])
    return this.status === statusKey;
  }
  checkStatuses(statusKeys){
    return statusKeys.indexOf(this.status) > -1;
  }
  
  onAttackedByEnemy(enemy){
    // console.log('hurt')
    this.setStatus(STATUS.ATTACKED);
    this.recoveryTimer = sceneRef.time.delayedCall(ATTACKED_DURATION, () => {
      this.setStatus(STATUS.IDLE);
    });
  }
  
  kill(){
    this.setStatus(STATUS.DEAD);
    this.delayedDestroy();
  }

  delayedDestroy(){
    this.destroyTimer = sceneRef.time.delayedCall(DESTROY_TIMEOUT, () => {
      this.destroy();
    });
  }

  chargeKick(){
    this.kickCharge += .1;
    if(this.kickCharge > 1){
      this.kickCharge = 1;
    }

    statBar.setProgress(this.kickCharge);
  }

  startKick(){
    if(!this.checkStatuses([STATUS.KICK, STATUS.KICK_PREP])){
      this.setStatus(STATUS.KICK_PREP);
    }
  }

  // helps to give a minimum kick strength, helps for tapping kick and not getting 0 strength
  // normalizes 0-1 between [ MIN_KICK_FORCE, 1 ]
  getModifiedKickCharge(){
    return MIN_KICK_FORCE + (this.kickCharge * (1 - MIN_KICK_FORCE));
  }

  kick(){
    this.setStatus(STATUS.KICK);

    this.recoveryTimer = sceneRef.time.delayedCall(this.getModifiedKickCharge() * KICK_DURATION, () => {
      this.cancelKick();
    });
  }

  cancelKick(){
    this.kickCharge = 0;
    statBar.setProgress(this.kickCharge);
    this.setStatus(STATUS.IDLE);
  }

  //- eventually this should be % charge * stats
  getKickStrength(){
    return this.getModifiedKickCharge();
  }


  startHug(){
    if(!this.checkStatus(STATUS.HUGGING)){
      this.setStatus(STATUS.HUGGING);
    }
  }
  cancelHug(){
    if(this.checkStatus(STATUS.HUGGING)){
      this.setStatus(STATUS.IDLE);
    }
  }


  onHugEnemy(enemy){
    // if(this.isAlive){
      // this.setStatus(STATUS.HUG);
      
      // this.startRecoveryTimer(() => {
      //   this.setStatus(STATUS.IDLE);
      // }, 500);
    // }
  }

  update(){
    const intent = this.getIntentFromStateAndKeys();
    if(intent !== this.lastIntent){
      this.lastIntent = intent;
      switch(intent){
        case 'attacked': break; //too bad, youre being attacked
        case 'moveUp': this.changeLane(-1); break;
        case 'moveDown': this.changeLane(1); break;
        case 'startKick': this.startKick(); break;
        case 'releaseKick': this.kick(); break;
        case 'startHug': this.startHug(); break;
        case 'cancelHug': this.cancelHug(); break;
        default: break;
      }
    }
  }

  getIntentFromStateAndKeys(){
    if(this.isAlive){
      if(this.checkStatus(STATUS.ATTACKED)){
        return 'attacked';
      }
      // moving up and down cancel most other events
      if(gameState.cursors.up.isDown){
        return 'moveUp';
      }
      if(gameState.cursors.down.isDown){
        return 'moveDown';
      }


      // if chargin a kick, see if you let it go
      if(this.checkStatus(STATUS.KICK_PREP)){
        if(!gameState.cursors.right.isDown){
          return 'releaseKick';
        }
      } else if(gameState.cursors.right.isDown){
        return 'startKick';
      }

      // now hugggs
      if(this.checkStatus(STATUS.HUGGING)){
        if(!gameState.cursors.left.isDown){
          return 'cancelHug';
        }
      } else if(gameState.cursors.left.isDown){
        return 'startHug';
      }

      // no other keys mattered so..?
    }
    return null;
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
      if(this.status === STATUS.ATTACKED){
        //- youre not attacked anymore, reset tint
        this.setTint(0xffffff);
      }
      this.status = status;

      switch(this.status){
        case STATUS.IDLE: 
          break;
        case STATUS.FEED: 
          break;
        case STATUS.KICK_PREP: 
          break;
        case STATUS.KICK: 
          break;
        case STATUS.ATTACKED: 
          this.setTint(0xff0000);
          break;
        case STATUS.DEAD: 
          this.isAlive = false;
          break;
        default: break;
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
    key: 'player_hug',
    frames: [ { key: 'player', frame: 2 }, { key: 'player', frame: 3 } ],
    frameRate: 4,
    repeat: -1
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

  
  StatBar.initSprites(sceneContext);
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('player', './assets/entity-oldlady.png', { frameWidth: 64, frameHeight: 88 });

  StatBar.initSpritesheet(sceneContext);
}

const exportMap = {
  Entity,
  initSprites,
  initSpritesheet,
}
export default exportMap; 