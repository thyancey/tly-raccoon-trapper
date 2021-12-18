import Phaser from 'phaser';
import raccoon from './entities/raccoon.js';
import Player from './entities/player.js';
import Bowl from './entities/bowl.js';
import { getDepthOfLane } from './utils/values';
import { throttle } from 'throttle-debounce';

const THROTTLE_SPEED = 150;
const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;
const SPAWN_LIMIT = -1;

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
  raccoon.initSpritesheet(sceneContext);
  Player.initSpritesheet(sceneContext);
  Bowl.initSpritesheet(sceneContext);
}

export const create = (spawnPos, eData, pData) => {

  spawnPositions = spawnPos;
  entityData = eData;
  spawnProbability = getSpawnProbability(eData);
  //- container for bad boyz
  groups.enemies = sceneContext.physics.add.group();
  groups.bowls = sceneContext.physics.add.group();
  groups.player = sceneContext.physics.add.staticGroup();

  Player.initSprites(sceneContext);
  Bowl.initSprites(sceneContext);
  raccoon.initSprites(sceneContext);

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
    case 'raccoon': spawnIt(raccoon.Entity, entityData.raccoon, laneIdx);
      break;
  }
}

export const update = () => {
  updateSpawnCount();
  groups.enemies.children.each(entity => {
    entity.update();
  });
  
  groups.player.children.each(entity => {
    entity.update();
  });

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

  throttledUpdate();
}


export const onThrottledUpdate = () => {
  groups.enemies.children.each(entity => {
    entity.throttledUpdate();
  });
  
  groups.player.children.each(entity => {
    entity.throttledUpdate();
  });
}

const throttledUpdate = throttle(THROTTLE_SPEED, false, onThrottledUpdate);

export const spawn = (group, key, anim, x, y) => {
  console.log(`spawn ${key} at (${x}, ${y})`)

  let item = groups[group].create(x, y, key);
  item.anims.play(anim);
  return item;
}



/* Internal spawn methods */

const randomizeStats = (statsObj = DEFAULT_STATUS_OBJ) => {
  return {
    speed: Phaser.Math.Between(statsObj.speed[0], statsObj.speed[1]),
    jumpRate: Phaser.Math.Between(statsObj.jumpRate[0], statsObj.jumpRate[1]),
  }
}

const spawnIt = (EntityRef, entityData, laneIdx) => {
  const pos = spawnPositions[laneIdx];
  const stats = randomizeStats(entityData.stats);
  
  let entity = new EntityRef(sceneContext, groups.enemies, {
    x: pos.x,
    y: pos.y,
    stats: stats,
    depth: getDepthOfLane(laneIdx)
  });
  const randomScale = Phaser.Math.Between(entityData.scaleRange[0], entityData.scaleRange[1]) / 100;
  entity.setScale(randomScale);

  
  // entity.setVelocity(Phaser.Math.Between(entityData.spawnSpeeds[0], entityData.spawnSpeeds[1]), 20);
}

export const spawnBowl = (x, y) => {
  let bowl = new Bowl.Entity(sceneContext, groups.bowls, {
    x: x,
    y: y
  });

  bowl.setVelocity(entityData.bowl.spawnSpeed, 20);
}

export const slingBowl = () => {
  let bowl = new Bowl.Entity(sceneContext, groups.bowls, {
    x: player.x + 20,
    y: player.y + 60,
    depth: getDepthOfLane(player.laneIdx, 1)
  });

  bowl.setVelocity(entityData.bowl.spawnSpeed, -100);
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
  slingBowl
}