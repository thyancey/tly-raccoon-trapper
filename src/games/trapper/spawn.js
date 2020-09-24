import Phaser from "phaser";
import img_player from "./assets/player.png";
import img_raccoonTest from "./assets/raccoon.png";
import img_raccoonWizard from "../../assets/raccoon-wizard.png";
import img_anibal01 from "./assets/anibal01.png";
import img_foodBowl from "../../assets/bowl.png";
import { Raccoon } from './entities/raccoon.js';
import { AnibalCritter } from './entities/anibal-critter.js';
import { Bowl } from './entities/bowl.js';
import { Player } from './entities/player.js';
import { RaccoonWizard } from '../../entities/raccoon-wizard.js';

const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;
const START_SPAWN_FREQUENCY = 25;

//- 0 - 1, ex: .5 is 50% of the time
const WIZARD_CHANCE = .1;
const ANIBAL_CHANCE = .3;

let spawnFrequency = null;
let curTicker = 0;
let spawnPositions = [];
let entityData = {};

const groups = {};
let player;
let sceneContext;

let el_spawnSlider;
let el_spawnCount;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.spritesheet('player', img_player, { frameWidth: 90, frameHeight: 120 });
  sceneContext.load.spritesheet('raccoonTest', img_raccoonTest, { frameWidth: 110, frameHeight: 110 });
  sceneContext.load.spritesheet('anibal01', img_anibal01, { frameWidth: 244, frameHeight: 174 });
  sceneContext.load.spritesheet('raccoonWizard', img_raccoonWizard, { frameWidth: 110, frameHeight: 137 });
  sceneContext.load.spritesheet('foodBowl', img_foodBowl, { frameWidth: 70, frameHeight: 40 });
}

export const create = (spawnPos, eData, pData) => {
  spawnPositions = spawnPos;
  entityData = eData;
  //- container for bad boyz
  groups.enemies = sceneContext.physics.add.group();
  groups.bowls = sceneContext.physics.add.group();
  groups.player = sceneContext.physics.add.staticGroup();

  initSprites();

  initSpawnControls();
  
  
  spawnPlayer(pData);
  return groups;
}

export const update = () => {
  // if(spawnFrequency === null){
  //   spawnFrequency = Math.round(getValue(25));
  // }
  updateSpawnCount();

  groups.enemies.children.each(entity => {
    entity.update();
  });
  
  // groups.bowls.children.each(entity => {
  //   entity.update();
  // });

  //- hack that stops spawning when slider at lowest value
  if(spawnFrequency !== SPAWN_MIN){
    if(curTicker > spawnFrequency){
      curTicker = 0;
      const laneIdx = Math.floor(Math.random() * spawnPositions.length);

      
      // if(Math.random() < WIZARD_CHANCE){
      //   spawnRaccoonWizard(laneIdx);
      // }
      if(Math.random() < ANIBAL_CHANCE){
        spawnAnibalCritter(laneIdx);
      }else{
        spawnRaccoon(laneIdx);
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
  return item;
}



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
    frames: sceneContext.anims.generateFrameNumbers('raccoonTest', { start: 6, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'raccoonTest_hug',
    frames: [ { key: 'raccoonTest', frame: 5 },  { key: 'raccoonTest', frame: 8 } ],
    frameRate: 20,
    repeat: -1
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



  /* ANIBALS CRITTER */
  sceneContext.anims.create({
    key: 'anibal01_walk',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 12, end: 14 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_angryWalk',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 3, end: 6 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_loveWalk',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 16, end: 18 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_dead',
    frames: [ { key: 'anibal01', frame: 0 } ],
    frameRate: 10
  });

  sceneContext.anims.create({
    key: 'anibal01_eat',
    frames: sceneContext.anims.generateFrameNumbers('anibal01', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  sceneContext.anims.create({
    key: 'anibal01_hug',
    frames: [ { key: 'anibal01', frame: 18 },  { key: 'anibal01', frame: 11 } ],
    frameRate: 5,
    repeat: -1
  });


  
  sceneContext.anims.create({
    key: 'player_idle',
    frames: sceneContext.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
}

const spawnRaccoon = (laneIdx) => {
  const pos = spawnPositions[laneIdx];
  let enemy = new Raccoon(sceneContext, pos.x, pos.y, groups.enemies);
  const randomScale = Phaser.Math.Between(entityData.raccoon.scaleRange[0], entityData.raccoon.scaleRange[1]) / 100;
  enemy.setScale(randomScale);


  enemy.setVelocity(Phaser.Math.Between(entityData.raccoon.spawnSpeeds[0], entityData.raccoon.spawnSpeeds[1]), 20);
}

const spawnRaccoonWizard = () => {
  const pos = spawnPositions[laneIdx];
  let enemy = new RaccoonWizard(sceneContext, pos.x, pos.y, groups.enemies);
  enemy.setVelocity(Phaser.Math.Between(-200, -800), 20);
}

const spawnAnibalCritter = (laneIdx) => {
  const pos = spawnPositions[laneIdx];
  let enemy = new AnibalCritter(sceneContext, pos.x, pos.y, groups.enemies);
  const randomScale = Phaser.Math.Between(entityData.anibal01.scaleRange[0], entityData.anibal01.scaleRange[1]) / 100;
  enemy.setScale(randomScale);


  enemy.setVelocity(Phaser.Math.Between(entityData.anibal01.spawnSpeeds[0], entityData.anibal01.spawnSpeeds[1]), 20);
}

export const spawnBowl = (x, y) => {
  let bowl = new Bowl(sceneContext, x, y, groups.bowls);
  bowl.setVelocity(entityData.bowl.spawnSpeed, 20);
}

export const slingBowl = () => {
  let bowl = new Bowl(sceneContext, player.x + 20, player.y + 60, groups.bowls);
  bowl.setVelocity(entityData.bowl.spawnSpeed, -200);
}

const spawnPlayer = (laneData) => {
  player = new Player(sceneContext, 800, 300, groups.player, laneData);
}


/* Spawn slider thingies */
const initSpawnControls = () => {
  el_spawnSlider = document.querySelector('#spawn-slider');
  onSpawnSlider(el_spawnSlider.value);
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


export const changeLane = (diff) => {
  player.changeLane(diff);
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
  spawn,
  spawnBowl,
  changeLane,
  slingBowl
}