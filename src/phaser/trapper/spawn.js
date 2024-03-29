import Phaser from 'phaser';

import Raccoon from './entities/raccoon';
import Player from './entities/player';
import Bowl from './entities/bowl';
import Status from './entities/status';
import { getDepthOfLane } from './utils/values';
import { throttle } from 'throttle-debounce';
import Events from '../event-emitter';
import { playSound, SOUNDS } from './sound';

const THROTTLE_SPEED = 150;
const SPAWN_MIN = 1000;
const SPAWN_MAX = 1;
const SPAWN_LIMIT = -1;

let spawnCount = 0;
let lastSentActiveEnemies = 0;
let spawnFrequency = null; // how often to roll dice for spawns
let curTicker = 0;
let spawnPositions = [];
let defGlobalEntities = {};
let defEnemyEntities = [];
let defLaneSpawns = [];

const groups = {};
let player;
let sceneContext;

const entityTypes = {
  'raccoon': Raccoon.Entity
}


export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  Raccoon.initSpritesheet(sceneContext);
  Player.initSpritesheet(sceneContext);
  Bowl.initSpritesheet(sceneContext);
  Status.initSpritesheet(sceneContext);
}

export const create = (globalEntities, levelData, sceneData) => {
  spawnPositions = sceneData.lanes.map(pO => ({
    x: parseInt(pO.x),
    y: parseInt(pO.y) - 50
  }));
  defGlobalEntities = globalEntities.misc;
  defEnemyEntities = globalEntities.enemies;
  defLaneSpawns = levelData.lanes.map(l => l.spawns);

  //- container for bad boyz
  groups.enemies = sceneContext.physics.add.group();
  groups.bowls = sceneContext.physics.add.group();
  groups.player = sceneContext.physics.add.staticGroup();

  Player.initSprites(sceneContext);
  Raccoon.initSprites(sceneContext);
  Bowl.initSprites(sceneContext);
  Status.initSprites(sceneContext);

  spawnPlayer(sceneData.lanes);
  return groups;
}

// from the supplied data and random rolls, get a list of entites to spawn, and the lanes they should spawn in
export const getSpawnCommands = laneSpawnData => {
  let enemies = [];
  laneSpawnData.forEach((lane, idx) => {
    lane.forEach(enemy => {
      if(Math.random() < enemy.rate){
        enemies.push({ 
          type: enemy.type, 
          laneIdx: idx 
        });
      }
    })
  });

  return enemies;
}

export const rollForSpawns = laneSpawnData => {
  const spawnCommands = getSpawnCommands(laneSpawnData);
  let spawnCount = 0;
  spawnCommands.forEach(sData => {
    const eData = defEnemyEntities[sData.type];
    if(entityTypes[eData.type]){
      spawnIt(entityTypes[eData.type], eData, sData.laneIdx);
      spawnCount++;
    }else{
      console.error('unknown entity type:', eData.type);
    }
  })

  return spawnCount;
}

export const update = () => {
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
        spawnCount += rollForSpawns(defLaneSpawns);
      }else{
        curTicker++;
      }
    }
  }

  throttledUpdate();
}

export const onThrottledUpdate = () => {
  if(global.gameActive){
    updateSpawnCount();
    groups.enemies.children?.each(entity => {
      entity.throttledUpdate();
    });
    
    groups.player.children?.each(entity => {
      entity.throttledUpdate();
    });
  }
}

const throttledUpdate = throttle(THROTTLE_SPEED, false, onThrottledUpdate);
export const spawn = (group, key, anim, x, y) => {
  // console.log(`spawn ${key} at (${x}, ${y})`)

  let item = groups[group].create(x, y, key);
  item.anims.play(anim);
  return item;
}

/* Internal spawn methods */
const randomizeStats = statsObj => {
  return {
    speed: Phaser.Math.FloatBetween(statsObj.speed[0], statsObj.speed[1]),
    jumpRate: Phaser.Math.FloatBetween(statsObj.jumpRate[0], statsObj.jumpRate[1]),
  }
}

const spawnIt = (EntityRef, entityData, laneIdx) => {
  const pos = spawnPositions[laneIdx];
  const stats = randomizeStats(entityData.stats);
  
  let entity = new EntityRef(sceneContext, groups.enemies, {
    x: pos.x,
    y: pos.y,
    stats: stats,
    depth: getDepthOfLane(laneIdx),
    misc: entityData.misc,
    type: entityData.type,
    particleDeath: entityData.particleDeath
  });
  const randomScale = Phaser.Math.FloatBetween(entityData.scaleRange[0], entityData.scaleRange[1]) / 100;
  entity.setScale(randomScale);
}

export const spawnStatus = (type, x, y, depth) => {
  new Status.Entity(sceneContext, x, y, type, depth);
};

export const spawnBowl = (x, y) => {
  let bowl = new Bowl.Entity(sceneContext, groups.bowls, {
    x: x,
    y: y
  });

  bowl.setVelocity(defGlobalEntities.bowl.spawnSpeed, 20);
}

export const slingBowl = () => {
  let bowl = new Bowl.Entity(sceneContext, groups.bowls, {
    x: player.x + 20,
    y: player.y + 90,
    depth: getDepthOfLane(player.laneIdx, 1)
  });

  bowl.setVelocity(defGlobalEntities.bowl.spawnSpeed, -100);
  
  playSound(SOUNDS.BOWL_SLING);
}

const spawnPlayer = (laneData) => {
  player = new Player.Entity(sceneContext, 800, 300, groups.player, laneData);
}

const updateSpawnCount = () => {
  const activeEnemies = groups.enemies.countActive();
  if(lastSentActiveEnemies !== activeEnemies){
    lastSentActiveEnemies = activeEnemies;
    Events.emit('interface', 'setMetric', { 'key': 'activeEnemies', 'value': activeEnemies });
  }
}

const formatSliderValue = sliderPosition => {
  var minPerc = 0;
  var maxPerc = 100;

  var minV = Math.log(SPAWN_MIN);
  var maxV = Math.log(SPAWN_MAX);
  
  var scale = (maxV-minV) / (maxPerc-minPerc);
  
  return Math.round(Math.exp(minV + scale*(sliderPosition-minPerc)));
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

export const external_setSpawnFrequency = (newValue) => {
  spawnFrequency = formatSliderValue(newValue);
}

const exportMap = {
  setContext,
  preload,
  create,
  update,
  spawn,
  spawnBowl,
  slingBowl,
  external_setSpawnFrequency
}
export default exportMap; 