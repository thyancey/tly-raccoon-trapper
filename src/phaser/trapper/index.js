import Phaser from 'phaser';

import gameData from './data.json';
import { STATUS as STATUS_ENEMY } from './entities/raccoon-simple';
import { STATUS as STATUS_PLAYER } from './entities/player';
import Events from '../event-emitter';
import SpawnController from './spawn.js';
import LevelController from './level.js';

let game;
let levelGroups;
let emitter;
let sceneContext;

let points = {
  bowls: 0,
  hugs: 0,
  bites: 0,
  captures: 0,
  escapes: 0
}

global.gameData = {
  curLevel: 0
}

export const killGame = () => {
  global.stopGame();
}

export const createGame = () =>{
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 900,
    height: 500,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 800 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  game = new Phaser.Game(config);
  global.game = game;
  global.gameActive = true;
}

global.stopGame = () => {
  // if not, hasnt been loaded yet
  if(sceneContext){
    global.gameActive = false;
    sceneContext.scene.stop();
  }
}

global.startGame = () => {
  global.gameActive = true;
  sceneContext.scene.start();
}

global.setLevel = (levelIdx) => {
  global.stopGame();
  global.gameData.curLevel = levelIdx;
  global.startGame();
}

function setSceneContext(context){
  sceneContext = context;
  global.scene = sceneContext;
  LevelController.setContext(context);
  SpawnController.setContext(context);
}

function preload() {
  this.load.audioSprite('sfx', './assets/sfx/mixdown.json', [ 'assets/sfx/splat.ogg', 'assets/sfx/splat.mp3'] );
  setSceneContext(this);
  this.load.image('blood', './assets/blood.png');
  LevelController.preload();
  SpawnController.preload();
}

function getLevel() {
  return gameData.levels[global.gameData.curLevel];
}

function getScene(){
  const level = gameData.levels[global.gameData.curLevel];
  return gameData.scenes[level.sceneKey];
}

function create() {
  //- make the level
  levelGroups = LevelController.create(getScene());
  Events.on('interface', onInterface, this);
  // var spritemap = this.cache.json.get('sfx').spritemap;

  let spawnGroups = SpawnController.create(gameData.entities, getLevel(), getScene());

  this.physics.add.collider(spawnGroups.enemies, levelGroups.platforms, null, collider_enemyAndPlatform, this);
  this.physics.add.collider(spawnGroups.bowls, levelGroups.platforms);
  this.physics.add.overlap(spawnGroups.enemies, spawnGroups.bowls, trigger_enemyAndBowl, null, this);
  this.physics.add.overlap(spawnGroups.bowls, levelGroups.leftTrigger, trigger_itemAtStart, null, this);
  this.physics.add.overlap(spawnGroups.enemies, levelGroups.rightTrigger, trigger_enemyAtEnd, null, this);
  this.physics.add.overlap(spawnGroups.enemies, spawnGroups.player, trigger_enemyAndPlayer, null, this);

  this.input.on('gameobjectdown', onObjectClicked);
  this.input.keyboard.on('keydown', onKeyDown);

  setupMouseEmitter();
}
function update (){
  SpawnController.update();
}

function onInterface(event, data){
  // console.log('onInterface', event, data);
  global.gameInterface && global.gameInterface(event, data)
}

function trigger_enemyAtEnd(enemy, trigger){
  switch(enemy.status){
    case STATUS_ENEMY.ROAMING_TAME:
      setPoints('captures', 1);
      enemy.captured();
      break;
    case STATUS_ENEMY.ROAMING_ANGRY:
      setPoints('escapes', 1);
      enemy.escaped();
      break;
    case STATUS_ENEMY.ROAMING:
      setPoints('escapes', 1);
      enemy.escaped();
      break;
    default: break;
  }
}

function trigger_itemAtStart(item, trigger){
  item.destroy();
  setPoints('bowls', 1);
}

function trigger_enemyAndBowl(enemy, bowl){
  if(enemy.canEat() && bowl.canBeEaten){
    enemy.eatAtBowl(bowl.body);
    bowl.eatenBy(enemy);
  }
}

function collider_enemyAndPlatform(enemy, platform){
  return true;
}

function trigger_enemyAndPlayer(enemy, player){
  if(enemy.isAlive()){
    // if player has arms open for a hug
    if(player.checkStatus(STATUS_PLAYER.HUGGING)){
        // hug happy raccoons that havent been hugged yet
      if(enemy.isFull){
        if(!enemy.checkStatus(STATUS_ENEMY.HUGGING)){
          enemy.hug();
          player.onHugEnemy();
          setPoints('hugs', 1);
        }
        // already got your hug lil dude, move along
      }else{
        // get bitten by mean boys. shouldnt trigger twice cause player moves out of hugging state
        player.onAttackedByEnemy();
        setPoints('bites', 1);
      }
    }else if(player.checkStatus(STATUS_PLAYER.KICK_PREP)){
      // enemy.punt ? enemy.punt() : enemy.kill();
    }else if(player.checkStatus(STATUS_PLAYER.KICK) && player.getKickStrength() > 0){
      if(enemy.punt){
        const wasKilled = enemy.punt(player.getKickStrength());
        if(wasKilled){
          showBlood(enemy.body.x, enemy.body.y);
        }
      }else{
        enemy.kill();
        showBlood(enemy.body.x, enemy.body.y);
      }
    }
  }

  //- anything else, just walk on by
}
function onObjectClicked(pointer, gameObject){
  showBlood(pointer.worldX, pointer.worldY);
}

function showBlood(x, y){
  emitter.setPosition(x, y);
  emitter.explode(20);
  emitter.visible = true;
  game.sound.playAudioSprite('sfx', 'splat1');
}

// function onSceneClicked(pointer){
//   SpawnController.spawnBowl(pointer.x, pointer.y);
// }

function setupMouseEmitter(){
  let particles = sceneContext.add.particles('blood');

  emitter = particles.createEmitter({
    visible: false,
    blendMode: 'SCREEN',
    speed: { min: -400, max: 400 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    lifespan: 500,
    gravityY: 1000
  });
}


const onKeyDown = (e) => {
  switch(e.code){
    case 'Space': SpawnController.slingBowl();
      break;
    default: break;
  }
}

const setPoints = (key, change) => {
  points[key] += change;

  updateScoreboard(key, points[key]);
}

const updateScoreboard = (key, value) => {
  Events.emit('interface', 'setStat', { 'key': key, 'value': value });
}


export const externalCommand = (event, payload) => {
  console.log('externalCommand:', event, payload);
}