import Phaser from 'phaser';
import Values from '../utils/values';

const SPRITE_KEY = 'statuses';

// ranges for how the status pops out
const rY = [ -200, -300 ];
const rX = [ -50, 50 ];

const DESTROY_TIMEOUT = 5000;
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

    const vX = Phaser.Math.Between(rX[0], rX[1]);
    const vY = Phaser.Math.Between(rY[0], rY[1]);
    this.setVelocity(vX, vY);

    this.alpha = 1;
    scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      delay: 300,
      ease: 'Cubic',
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
    frames: sceneContext.anims.generateFrameNumbers(SPRITE_KEY, { start: 0, end: 4 }),
    frameRate: 12,
    repeat: 0,
  });
  
  sceneContext.anims.create({
    key: 'status_hug',
    frames: sceneContext.anims.generateFrameNumbers(SPRITE_KEY, { start: 5, end: 9 }),
    frameRate: 12,
    repeat: 0,
  });
  
  sceneContext.anims.create({
    key: 'status_lost',
    frames: sceneContext.anims.generateFrameNumbers(SPRITE_KEY, { start: 10, end: 14 }),
    frameRate: 12,
    repeat: 0,
  });
  
  sceneContext.anims.create({
    key: 'status_tame',
    frames: sceneContext.anims.generateFrameNumbers(SPRITE_KEY, { start: 15, end: 19 }),
    frameRate: 12,
    repeat: 0,
  });
}

const initSpritesheet = (sceneContext) => {
  sceneContext.load.spritesheet(SPRITE_KEY, './assets/sprites/statuses.png', { frameWidth: 80, frameHeight: 50 } )
}

const exportMap = {
  Entity,
  initSprites,
  initSpritesheet,
}
export default exportMap; 