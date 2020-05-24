import Phaser from "phaser";
import img_raccoonTest from "./assets/raccoon1.png";

const spawnFrequency = 100;
let curTicker = 0;

let enemies;

const spawnThing = () => {
  let enemy = enemies.create(0, 16, 'raccoon');
  enemy.setBounce(.5);
  enemy.setCollideWorldBounds(true);
  enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
  enemy.allowGravity = false;
  enemy.anims.play('right');
}

export const spawn_preload = (context) => {
  context.load.spritesheet('raccoon', img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
}


export const spawn_create = (context) => {
  // context.load.spritesheet("raccoon", img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
  

  enemies = context.physics.add.group();

  context.anims.create({
    key: 'right',
    frames: context.anims.generateFrameNumbers('raccoon', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });
}

export const spawn_update = () => {
  enemies.children.each(entity => {
    entity.flipX = entity.body.velocity.x < 0;
  });

  checkSpawn();
}

export const checkSpawn = () => {
  // console.log('checkSpawn')

  curTicker++;
  if(curTicker > spawnFrequency){
    curTicker = 0;
    spawnThing();
  }
}