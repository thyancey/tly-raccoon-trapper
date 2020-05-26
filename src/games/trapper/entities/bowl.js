import Phaser from "phaser";

const KILL_TIMEOUT = 1000;
const DRAIN_TIMER_INTERVAL = 500;
const MAX_FEEDING = 1;

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

export class Bowl extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup) {
    super(scene, x, y, 'foodBowl');

    this.drainRate = 0;
    this.drainStart = null;
    this.drainTimer = null;
    this.hpRange = [ 0, 100 ];
    this.hp = this.hpRange[1];

    this.feeding = [];
    this.canBeEaten = true;

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }

    this.setDepth(1);

    //- physics
    this.setBounce(.4);
    this.setCollideWorldBounds(true);
    // this.allowGravity = false;

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
    this.drainStart = new Date();
    this.killDrainTimer();
    this.drainTimer = global.setTimeout(() => {
      this.onDrainTimer();
    }, DRAIN_TIMER_INTERVAL);
  }

  onDrainTimer(){
    const secondsSinceDrainStart = (new Date() - this.drainStart) / 1000;
    const drainAmount = secondsSinceDrainStart * this.drainRate;
    this.hp = this.hp - drainAmount;
    // console.log(`hp: ${this.hp}, drainRate: ${this.drainRate}, drainAmount: ${drainAmount}`);
    if(this.hp <= this.hpRange[0]){
      this.hp = this.hpRange[0];
      this.killDrainTimer();
      this.emptyBowl();
    }else{
      if(this.hp > this.hpRange[1]){
        this.hp = this.hpRange[1];
      }
      this.startDrainTimer();
    }
  }

  killDrainTimer(){
    if(this.drainTimer){
      global.clearTimeout(this.drainTimer);
      this.drainTimer = null;
    }
  }

  emptyBowl(){
    this.setStatus(STATUS.EMPTY);
    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT);
  }

  touched(entity){
    if(this.feeding.indexOf(entity) === -1){
      entity.body.velocity.x = 0;
      //- new feeder
      this.addToDrainRate(20);
      this.feeding.push(entity);
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
            feeder.bowlEmpty();
          })
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