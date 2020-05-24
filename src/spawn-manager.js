import Phaser from "phaser";
import img_raccoonTest from "./assets/raccoon1.png";
import img_bar from "./assets/bar.png";
import { Raccoon } from './entities/raccoon.js';

const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;

let spawnFrequency = 50;
let curTicker = 0;

let enemies;
let platforms;
let sceneContext;

let el_spawnSlider;
let el_spawnCount;

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
  document.querySelector('#spawn-display').innerHTML = `${sliderVal}%`;
}

const spawnRaccoon = () => {
  let enemy = new Raccoon(sceneContext, 0, 50, enemies);
  enemy.setVelocity(Phaser.Math.Between(200, 800), 20);
  
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
  sceneContext = context;
  el_spawnSlider = document.querySelector('#spawn-slider');
  el_spawnSlider.oninput = (e) => {
    onSpawnSlider(e.target.value);
  }
  el_spawnCount = document.querySelector('#spawn-count');
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
  
  // spawnRaccoon(context, enemies);
}

const checkForJump = (entity, chance) => {
  if(entity.isAlive && entity.body.touching.down && Math.random() < chance){
    entity.setVelocityX((1 + Math.random()) * entity.body.velocity.x);
    entity.setVelocityY(Math.random() * - 300);
  }
}



export const spawn_update = () => {
  updateSpawnCount();

  enemies.children.each(entity => {
    entity.updateChild();
  });

  curTicker++;
  //- hack to have slider all the way down to "stop"
  if(spawnFrequency !== SPAWN_MIN){
    if(curTicker > spawnFrequency){
      curTicker = 0;
      spawnRaccoon();
    }
  }
}

export const updateSpawnCount = () => {
  if(parseInt(el_spawnCount.innerHTML) !== enemies.countActive()){
    el_spawnCount.innerHTML = enemies.countActive();
  }
}

/*
//- this approach seems to perform a lot better, however cannot extend gameobject class correctly
const basicSpawn = () => {
  let enemy = enemies.create(0, 50, 'raccoon_walk');
  // console.log('instance:', enemy)

  //- physics
  enemy.setBounce(.4);
  enemy.setCollideWorldBounds(true);
  enemy.allowGravity = false;
  
  //- squeeze in hit box from edge of sprite
  enemy.body.setSize(60,70);
  enemy.body.offset.x = 35;
  enemy.body.offset.y = 30;
  enemy.anims.play('raccoon_walk');

  enemy.setVelocity(Phaser.Math.Between(200, 800), 20);
}
 */