import Phaser from "phaser";
import img_raccoonWizard from "../../assets/raccoon-wizard.png";
import img_foodBowl from "../../assets/bowl.png";
import Raccoon from './entities/raccoon.js';
import NewRaccoon from './entities/new-raccoon.js';
import AnibalCritter from './entities/anibal-critter.js';
import Player from './entities/player.js';
import { Bowl } from './entities/bowl.js';
import { RaccoonWizard } from '../../entities/raccoon-wizard.js';

const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;
const SPAWN_LIMIT = -1;
const DEFAULT_STATS_OBJ = {
  "stats":{
    "speed": [ 10, 40 ],
    "jumpRate": [ ".005", ".1" ]
  }
}

let spawnProbability = [];
let spawnCount = 0;

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
  Raccoon.initSpritesheet(sceneContext);
  NewRaccoon.initSpritesheet(sceneContext);
  Player.initSpritesheet(sceneContext);
  AnibalCritter.initSpritesheet(sceneContext);
  sceneContext.load.spritesheet('raccoonWizard', img_raccoonWizard, { frameWidth: 110, frameHeight: 137 });
  sceneContext.load.spritesheet('foodBowl', img_foodBowl, { frameWidth: 70, frameHeight: 40 });
}

export const create = (spawnPos, eData, pData) => {

  spawnPositions = spawnPos;
  entityData = eData;
  spawnProbability = getSpawnProbability(eData);
  //- container for bad boyz
  groups.enemies = sceneContext.physics.add.group();
  groups.bowls = sceneContext.physics.add.group();
  groups.player = sceneContext.physics.add.staticGroup();

  initSprites();
  Player.initSprites(sceneContext);
  AnibalCritter.initSprites(sceneContext);
  Raccoon.initSprites(sceneContext);
  NewRaccoon.initSprites(sceneContext);

  initSpawnControls();
  
  
  spawnPlayer(pData);
  return groups;
}

const getSpawnProbability = (entitiesList) => {
  const probability = [];

  let totRate = 0;
  Object.keys(entitiesList).forEach(k => {
    if(entitiesList[k].spawnRate){
      totRate += +entitiesList[k].spawnRate;
    }
  });
  let adj = 1 / totRate;
  
  let curVal = 0;
  Object.keys(entitiesList).forEach(k => {
    if(entitiesList[k].spawnRate){
      curVal += +entitiesList[k].spawnRate * adj;
      probability.push({
        key: k,
        rate: curVal
      });
    }
  });

  return probability;
}

const getSpawnKey = spawnProbability => {
  const rando = Math.random();
  for(let i = 0; i < spawnProbability.length; i++){
    if(spawnProbability[i].rate > rando){
      return spawnProbability[i].key;
    }
  }

  return null;
}

const spawnAnEnemy = (laneIdx) => {
  const spawnKey = getSpawnKey(spawnProbability);

  switch(spawnKey){
    case 'raccoon': spawnIt(Raccoon.Entity, entityData.raccoon, laneIdx);
      break;
    case 'newRaccoon': spawnIt(NewRaccoon.Entity, entityData.newRaccoon, laneIdx);
      break;
    case 'anibal01': spawnIt(AnibalCritter.Entity, entityData.anibal01, laneIdx);
      break;
  }
}

export const update = () => {
  updateSpawnCount();

  groups.enemies.children.each(entity => {
    entity.update();
  });
  
  // groups.bowls.children.each(entity => {
  //   entity.update();
  // });

  //- hack that stops spawning when slider at lowest value
  if(SPAWN_LIMIT === -1 || spawnCount < SPAWN_LIMIT){
    if(spawnFrequency !== SPAWN_MIN){
      if(curTicker > spawnFrequency){
        curTicker = 0;
        const laneIdx = Math.floor(Math.random() * spawnPositions.length);
        spawnAnEnemy(laneIdx);
        spawnCount++;
      }else{
        curTicker++;
      }
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

const spawnRaccoonWizard = () => {
  const pos = spawnPositions[laneIdx];
  let enemy = new RaccoonWizard(sceneContext, pos.x, pos.y, groups.enemies);
  enemy.setVelocity(Phaser.Math.Between(-200, -800), 20);
}

const randomizeStats = (statsObj = DEFAULT_STATUS_OBJ) => {
  return {
    speed: Phaser.Math.Between(+statsObj.speed[0], +statsObj.speed[1]),
    jumpRate: Phaser.Math.Between(+statsObj.jumpRate[0], +statsObj.jumpRate[1]),
  }
}
const spawnIt = (EntityRef, entityData, laneIdx) => {
  const pos = spawnPositions[laneIdx];
  const stats = randomizeStats(entityData.stats);
  
  let entity = new EntityRef(sceneContext, pos.x, pos.y, groups.enemies, stats);
  const randomScale = Phaser.Math.Between(entityData.scaleRange[0], entityData.scaleRange[1]) / 100;
  entity.setScale(randomScale);

  
  // entity.setVelocity(Phaser.Math.Between(entityData.spawnSpeeds[0], entityData.spawnSpeeds[1]), 20);
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
  player = new Player.Entity(sceneContext, 800, 300, groups.player, laneData);
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