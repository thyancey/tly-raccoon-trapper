import Phaser from "phaser";
import img_raccoonTest from "./assets/raccoon1.png";
import img_bar from "./assets/bar.png";


const SPAWN_MIN = 1000;
const SPAWN_MAX = 10;

let spawnFrequency = 50;
let curTicker = 1000;

let enemies;
let platforms;

let spawnSlider;

const getValue = position => {
  var minp = 0;
  var maxp = 100;

  var minv = Math.log(SPAWN_MIN);
  var maxv = Math.log(SPAWN_MAX);
  
  var scale = (maxv-minv) / (maxp-minp);
  
  return Math.exp(minv + scale*(position-minp));
}

const onSpawnSlider = sliderVal => {
  spawnFrequency = Math.round(getValue(sliderVal));
  
  const sliderPercent = sliderVal / 100;
  document.querySelector('#spawn-display').innerHTML = `${sliderVal}%`;
}

const spawnRaccoon = () => {
  let enemy = enemies.create(0, 50, 'raccoon_walk')
  // let enemy = enemies.create(0, 50, 'raccoon_walk').setInteractive();
  enemy.isAlive = true;
  enemy.kill = () => {
    console.log('YOU KILLED ME');
    enemy.anims.play('raccoon_dead');
    enemy.body.setDrag(500);
    enemy.isAlive = false;
  }

  enemy.setBounce(.4);
  enemy.setCollideWorldBounds(true);

  enemy.setVelocity(Phaser.Math.Between(200, 800), 20);
  //- squeeze in hit box from edge of sprite
  enemy.body.setSize(60,70);
  enemy.body.offset.x = 35;
  enemy.body.offset.y = 30;
  enemy.allowGravity = false;
  enemy.anims.play('raccoon_walk');
  enemy.setInteractive();

  enemy.on('pointerdown', (thing) => {
    enemy.kill();
  });
}

export const spawn_preload = (context) => {
  context.load.spritesheet('raccoon', img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
  context.load.image('bar', img_bar);
}

export const spawn_create = (context) => {
  spawnSlider = document.querySelector('#spawn-slider');
  // spawnSlider.addEventListener('change', (e) => {
  //   onSpawnSlider(e.target.value);
  // })
  spawnSlider.oninput = (e) => {
    onSpawnSlider(e.target.value);
  }

  //- make the level
  platforms = context.physics.add.staticGroup();

  platforms.create(450, 500, 'bar').setScale(4, .5).refreshBody();
  platforms.create(800, 480, 'bar');
  platforms.create(50, 220, 'bar').setScale(-1, .5).refreshBody();

  //- init the enemy stuff

  enemies = context.physics.add.group();

  context.anims.create({
    key: 'raccoon_walk',
    frames: context.anims.generateFrameNumbers('raccoon', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  context.anims.create({
    key: 'raccoon_dead',
    frames: [ { key: 'raccoon', frame: 2 } ],
    frameRate: 10
  });
  
  context.physics.add.collider(enemies, platforms);
}

const checkForJump = (entity, chance) => {

  if(entity.isAlive && entity.body.touching.down && Math.random() < chance){
    entity.setVelocityX((1 + Math.random()) * entity.body.velocity.x);
    entity.setVelocityY(Math.random() * - 300);
  }
}

export const spawn_update = () => {
  enemies.children.each(entity => {
    if(entity.flipX){
      if(entity.body.velocity.x > 0) entity.flipX = false;
    }else{
      if(entity.body.velocity.x < 0) entity.flipX = true;
    }

    checkForJump(entity, .05);
  });
  checkSpawn();
}

export const checkSpawn = () => {
  // console.log('checkSpawn')

  curTicker++;
  if(curTicker > spawnFrequency){
    curTicker = 0;
    // spawnFrequency *= .8;
    spawnRaccoon();
  }
}