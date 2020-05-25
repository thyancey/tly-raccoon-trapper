import Phaser from "phaser";
import img_raccoonTest from "../assets/raccoon1.png";
import img_raccoonWizard from "../assets/raccoon-wizard.png";
import img_foodBowl from "../assets/bowl.png";
import { Raccoon } from '../entities/raccoon.js';
import { RaccoonWizard } from '../entities/raccoon-wizard.js';

const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;

//- 0 - 1, ex: .5 is 50% of the time
const WIZARD_CHANCE = 0;

let spawnFrequency = 50;
let curTicker = 0;

const groups = {};
let enemies;
let items;
let sceneContext;

let el_spawnSlider;
let el_spawnCount;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.spritesheet('raccoonTest', img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
  sceneContext.load.spritesheet('raccoonWizard', img_raccoonWizard, { frameWidth: 110, frameHeight: 137 });
  sceneContext.load.spritesheet('foodBowl', img_foodBowl, { frameWidth: 70, frameHeight: 40 });
}

export const create = () => {
  //- container for bad boyz
  groups.enemies = sceneContext.physics.add.group();
  groups.items = sceneContext.physics.add.group();

  initSprites();

  initSpawnControls();
  
  return groups;
}

export const update = () => {
  updateSpawnCount();

  groups.enemies.children.each(entity => {
    entity.update();
  });

  //- hack that stops spawning when slider at lowest value
  if(spawnFrequency !== SPAWN_MIN){
    if(curTicker > spawnFrequency){
      curTicker = 0;
      if(Math.random() < WIZARD_CHANCE){
        spawnRaccoonWizard();
      }else{
        spawnRaccoon();
      }
    }else{
      curTicker++;
    }
  }
}

export const spawn = (group, key, anim, x, y) => {
  console.log(`spawn ${key} at (${x}, ${y})`)

  let item = groups[group].create(x, y, key);
  item.anims.play(anim);

  //- physics
  // item.setCollideWorldBounds(true);
  // item.allowGravity = false;
}

/*
for storing instructions in json later...

const spriteDefs = {
  racoonTest_walk:{
    sprite: {
      type: 'multi',
      key: 'racoonTest',
      frames: { start:0, end: 1}
    },
    frameRate: 10,
    repeat: -1
  },
  racoonTest_dead:{
    sprite: {
      type: 'single',
      key: 'raccoon',
      frame: 2
    },
    frameRate: 10
  }
}
*/

/* Internal spawn methods */
const initSprites = () => {
  sceneContext.anims.create({
    key: 'raccoonTest_walk',
    frames: sceneContext.anims.generateFrameNumbers('raccoonTest', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonTest_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers('raccoonTest', { start: 3, end: 4 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonTest_dead',
    frames: [ { key: 'raccoonTest', frame: 2 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'raccoonTest_eat',
    frames: [ { key: 'raccoonTest', frame: 5 } ],
    frameRate: 10
  });

  
  sceneContext.anims.create({
    key: 'raccoonWizard_walk',
    frames: sceneContext.anims.generateFrameNumbers('raccoonWizard', { start: 3, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonWizard_dead',
    frames: sceneContext.anims.generateFrameNumbers('raccoonWizard', { start: 6, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

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

const spawnRaccoon = () => {
  let enemy = new Raccoon(sceneContext, 0, 50, groups.enemies);
  enemy.setVelocity(Phaser.Math.Between(200, 800), 20);
}

const spawnRaccoonWizard = () => {
  let enemy = new RaccoonWizard(sceneContext, 700, 50, groups.enemies);
  enemy.setVelocity(Phaser.Math.Between(-200, -800), 20);
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
  if(parseInt(el_spawnCount.innerHTML) !== groups.enemies.countActive()){
    el_spawnCount.innerHTML = groups.enemies.countActive();
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
  update,
  spawn
}