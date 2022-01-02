import Phaser from "phaser";
import { spawnStatus } from "../spawn";

const DESTROY_TIMEOUT = 1000;
const DRAIN_TIMER_INTERVAL = 500;
const MAX_FEEDING = 1;
let sceneRef;

export const STATUS = {
  FULL: 0,
  EATING: 1,
  EMPTY: 2
}

const animationStatus = {
  [STATUS.FULL]: 'foodBowl_full',
  [STATUS.EATING]: 'foodBowl_full',
  [STATUS.EMPTY]: 'foodBowl_empty'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, 'foodBowl');
    sceneRef = scene;

    this.drainRate = 0;
    this.drainStart = null;
    this.drainTimer = null;
    this.destroyTimer = null;

    this.hpRange = [ 0, 100 ];
    this.hp = this.hpRange[1];

    this.feeding = [];
    this.canBeEaten = true;

    //- parent stuff
    scene.add.existing(this);
    if(!isNaN(spawnData.depth)) {
      this.setDepth(spawnData.depth);
    }
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }

    //- physics
    this.setBounce(.4);
    this.setCollideWorldBounds(true);
    // this.allowGravity = false;
    
    this.body.setSize(36,15);
    this.body.offset.y = -2;

    this.setStatus(STATUS.FULL, true);
  }

  addToDrainRate(drainRate){
    this.drainRate += drainRate;
    // console.log(`addToDrainRate to ${this.drainRate}`);

    this.startDrainTimer();
  }

  setDrainRate(drainRate){
    console.log(`setDrainRate to ${this.drainRate}`);
    this.drainRate = drainRate;

    this.startDrainTimer();
  }

  startDrainTimer(){
    this.drainTimer = sceneRef.time.delayedCall(DRAIN_TIMER_INTERVAL, () => {
      this.onDrainTimer();
    });

    this.drainStart = new Date();
  }

  onDrainTimer(){
    const secondsSinceDrainStart = (new Date() - this.drainStart) / 1000;
    const drainAmount = secondsSinceDrainStart * this.drainRate;
    this.hp = this.hp - drainAmount;
    // console.log(`hp: ${this.hp}, drainRate: ${this.drainRate}, drainAmount: ${drainAmount}`);
    if(this.hp <= this.hpRange[0]){
      this.hp = this.hpRange[0];
      this.emptyBowl();
    }else{
      if(this.hp > this.hpRange[1]){
        this.hp = this.hpRange[1];
      }
      this.startDrainTimer();
    }
  }

  emptyBowl(){
    this.setStatus(STATUS.EMPTY);
    this.destroyTimer = sceneRef.time.delayedCall(DESTROY_TIMEOUT, () => {
      this.destroy();
    });
  }

  eatenBy(enemyEntity){
    if(this.feeding.indexOf(enemyEntity) === -1){
      enemyEntity.body.velocity.x = 0;
      //- new feeder
      this.addToDrainRate(20);
      this.feeding.push(enemyEntity);
      if(this.feeding.length >= MAX_FEEDING){
        this.canBeEaten = false;
      }
    }else{
      // console.log('feeding with ', this.feeding.length);
    }

    if(this.status === STATUS.FULL){
      this.setStatus(STATUS.EATING);
    }
  }

  update(){
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      switch(this.status){
        case STATUS.FULL: 
          break;
        case STATUS.EATING: 
          this.body.velocity.x = 0;
          this.body.setDrag(500);

          break;
        case STATUS.EMPTY: 
          this.canBeEaten = false;
          this.feeding.forEach(feeder => {
            spawnStatus('tame', feeder.body.x, feeder.body.y, feeder.depth);
            feeder.bowlEmpty();
          })
          break;
        default:;
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
    key: 'foodBowl_full',
    frames: [ { key: 'foodBowl', frame: 0 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'foodBowl_empty',
    frames: [ { key: 'foodBowl', frame: 1 } ],
    frameRate: 10
  });
}


const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('foodBowl', './assets/bowl.png', { frameWidth: 38, frameHeight: 22 });
}

const exportMap = {
  Entity,
  initSprites,
  initSpritesheet
}
export default exportMap; 