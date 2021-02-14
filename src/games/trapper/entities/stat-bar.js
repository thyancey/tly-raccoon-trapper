import Phaser from 'phaser';
import img_statBar from '../assets/statbar.png';

const NUM_CELLS = 7;

const OFFSET = {
  x: 30,
  y: -10
};

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'statBar');

    this.progress = 0;
    scene.add.existing(this);
  }

  update(){
  }

  setOffsetPosition(x, y){
    this.setPosition(x + OFFSET.x, y + OFFSET.y);
  }

  playAnimationForProgress(){
    const cellIdx = Math.floor(NUM_CELLS * this.progress);
    this.anims.play(`statBar_${cellIdx}`);
  }

  setProgress(progress, force){
    // console.log('setStatus', status);
    if(force || this.progress !== progress){
      this.progress = progress;

      const cellIdx = Math.floor(7 * this.progress);
      this.anims.play(`statBar_${cellIdx}`);
    }
  }
}

const initSprites = (sceneContext) => {
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
  sceneContext.load.spritesheet('statBar', img_statBar, { frameWidth: 45, frameHeight: 10 } )
}

export default {
  Entity,
  initSprites,
  initSpritesheet,
}