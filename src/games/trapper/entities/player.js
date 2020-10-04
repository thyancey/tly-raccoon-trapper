import Phaser from "phaser";
import img_player from "../assets/player.png";

export const STATUS = {
  IDLE: 0,
  FEED: 1,
  HUG: 2,
  DEAD: 3
}

const animationStatus = {
  [STATUS.IDLE]: 'player_idle',
  [STATUS.FEED]: 'player_idle',
  [STATUS.HUG]: 'player_idle',
  [STATUS.DEAD]: 'player_idle'
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup, laneData) {
    super(scene, x, y, 'player');

    this.hpRange = [ 0, 100 ];
    this.hp = this.hpRange[1];
    this.laneIdx = 0;
    this.laneValues = this.parseLaneData(laneData);

    this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }

    this.setDepth(0);

    /* would rather use lower left, but I cant figure out how, the body and sprite keep getting out of sync */
    this.body.setSize(90,120);
    this.body.offset.x = 0;
    this.body.offset.y = 0;
    this.setOrigin(0, 0).refreshBody();

    this.updatePlayerPosition();
    this.setStatus(STATUS.IDLE, true);
  }

  parseLaneData(laneData){
    return laneData.map(lane => ({
      x: parseInt(lane.x) + parseInt(lane.width) - 20,
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
    this.body.x = pos.x;
    this.body.y = pos.y;
    this.setPosition(pos.x, pos.y);
  }
  
  bit(enemy){
    if(this.alive){
      this.setStatus(STATUS.DEAD);
    }
  }

  hugged(enemy){
    if(this.alive){
      this.setStatus(STATUS.HUG);
    }
  }

  update(){
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      switch(this.status){
        case STATUS.IDLE: 
          break;
        case STATUS.HUG: 
          break;
        case STATUS.DEAD: 
          this.alive = false;
          break;
      }
      const animKey = animationStatus[this.status];
      if(animKey){
        this.anims.play(animKey);
      }
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
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('player', img_player, { frameWidth: 90, frameHeight: 120 });
}

export default {
  Entity,
  initSprites,
  initSpritesheet
}