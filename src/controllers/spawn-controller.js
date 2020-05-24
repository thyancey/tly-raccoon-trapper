import Phaser from "phaser";
import img_raccoonTest from "../assets/raccoon1.png";
import { Raccoon } from '../entities/raccoon.js';

const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;

let spawnFrequency = 50;
let curTicker = 0;

let enemies;
let sceneContext;

let el_spawnSlider;
let el_spawnCount;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.spritesheet('raccoon', img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
}

export const create = () => {
  //- container for bad boyz
  enemies = sceneContext.physics.add.group();

  initSprites();

  initSpawnControls();
  
  return {
    enemies
  }
}

export const update = () => {
  updateSpawnCount();

  enemies.children.each(entity => {
    entity.update();
  });

  //- hack that stops spawning when slider at lowest value
  if(spawnFrequency !== SPAWN_MIN){
    if(curTicker > spawnFrequency){
      curTicker = 0;
      spawnRaccoon();
    }else{
      curTicker++;
    }
  }
}


/* Internal spawn methods */
const initSprites = () => {
  sceneContext.anims.create({
    key: 'raccoon_walk',
    frames: sceneContext.anims.generateFrameNumbers('raccoon', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoon_dead',
    frames: [ { key: 'raccoon', frame: 2 } ],
    frameRate: 10
  });
}

const spawnRaccoon = () => {
  let enemy = new Raccoon(sceneContext, 0, 50, enemies);
  enemy.setVelocity(Phaser.Math.Between(200, 800), 20);
}





/* Spawn slider thingies */
const initSpawnControls = () => {
  el_spawnSlider = document.querySelector('#spawn-slider');
  el_spawnSlider.oninput = (e) => {
    onSpawnSlider(e.target.value);
  }
  el_spawnCount = document.querySelector('#spawn-count');
}

const updateSpawnCount = () => {
  if(parseInt(el_spawnCount.innerHTML) !== enemies.countActive()){
    el_spawnCount.innerHTML = enemies.countActive();
  }
}

const onSpawnSlider = sliderVal => {
  spawnFrequency = Math.round(getValue(sliderVal));
  document.querySelector('#spawn-display').innerHTML = `${sliderVal}%`;
}

const getValue = position => {
  var minp = 0;
  var maxp = 100;

  var minv = Math.log(SPAWN_MIN);
  var maxv = Math.log(SPAWN_MAX);
  
  var scale = (maxv-minv) / (maxp-minp);
  
  return Math.exp(minv + scale*(position-minp));
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


export default {
  setContext,
  preload,
  create,
  update
}