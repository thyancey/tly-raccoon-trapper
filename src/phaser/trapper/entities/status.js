import Phaser from 'phaser';
import Values from '../utils/values';

const DESTROY_TIMEOUT = 500;
const OFFSET = {
  x: 0,
  y: 0
};

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, statType, depth) {
    super(scene, x, y, 'status');

    this.statType = statType;

    if(!depth){
      depth = Values.zindex.FOREGROUND;
    }
    this.setDepth(depth + 1);
    this.setOffsetPosition(x, y);
    this.playAnimationForType();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.allowGravity = true;
    this.setDrag(0);
    this.setVelocity(0, -200);

    this.alpha = 1;
    scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      repeat: 0
    });

    this.destroyTimer = scene.time.delayedCall(DESTROY_TIMEOUT, () => {
      this.destroy();
    });
  }

  setOffsetPosition(x, y){
    this.setPosition(x + OFFSET.x, y + OFFSET.y);
  }

  playAnimationForType(){
    this.anims.play(`status_${this.statType}`);
  }

  update(){
  }
}


const initSprites = (sceneContext) => {
  sceneContext.anims.create({
    key: 'status_bite',
    frames: [ { key: 'status', frame: 0 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'status_hug',
    frames: [ { key: 'status', frame: 1 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'status_lost',
    frames: [ { key: 'status', frame: 2 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'status_full',
    frames: [ { key: 'status', frame: 3 } ],
    frameRate: 0,
    repeat: -1
  });
  
  sceneContext.anims.create({
    key: 'status_tame',
    frames: [ { key: 'status', frame: 4 } ],
    frameRate: 0,
    repeat: -1
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet('status', './assets/sprites/status.png', { frameWidth: 60, frameHeight: 30 } )
}

const exportMap = {
  Entity,
  initSprites,
  initSpritesheet,
}
export default exportMap; 