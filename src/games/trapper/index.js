import Phaser from 'phaser';
import img_blood from './assets/blood.png';
import gameData from './data.json';
import { STATUS as STATUS_ENEMY } from './entities/raccoon-simple';
import { STATUS as STATUS_PLAYER } from './entities/player';

import SpawnController from './spawn.js';
import LevelController from './level.js';

let game;
let levelGroups;
let emitter;
let sceneContext;

const scoreElements = {
  bowls:null,
  bites:null,
  hugs:null,
  total: null
}

let points = {
  bowls: 0,
  hugs: 0,
  bites: 0,
  total: 0,
  captures: 0,
  escapes: 0
}

global.gameData = {
  curLevel: 0
}

export const createGame = () =>{
  const config = {
    type: Phaser.AUTO,
    parent: "game-container",
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
  global.gameActive = true;
}

global.stopGame = () => {
  global.gameActive = false;
  sceneContext.scene.stop();
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
  setSceneContext(this);
  
  this.load.image('blood', img_blood);
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
  initScoreboard();

  let spawnGroups = SpawnController.create(gameData.entities, getLevel(), getScene());

  this.physics.add.collider(spawnGroups.enemies, levelGroups.platforms, null, collider_enemyAndPlatform, this);
  this.physics.add.collider(spawnGroups.bowls, levelGroups.platforms);
  this.physics.add.overlap(spawnGroups.enemies, spawnGroups.bowls, trigger_enemyAndBowl, null, this);
  this.physics.add.overlap(spawnGroups.bowls, levelGroups.leftTrigger, trigger_itemAtStart, null, this);
  this.physics.add.overlap(spawnGroups.enemies, levelGroups.rightTrigger, trigger_enemyAtEnd, null, this);
  this.physics.add.overlap(spawnGroups.enemies, spawnGroups.player, trigger_enemyAndPlayer, null, this);

  this.input.on('gameobjectdown', onObjectClicked);
  // this.input.on('pointerdown', onSceneClicked);
  this.input.keyboard.on('keydown', onKeyDown);

  setupMouseEmitter();
}

function trigger_enemyAtEnd(enemy, trigger){
  switch(enemy.status){
    case STATUS_ENEMY.ROAMING_TAME: {
        setPoints('captures', 1);
        enemy.captured();
      }
      break;
    case STATUS_ENEMY.ROAMING_ANGRY: {
        setPoints('escapes', 1);
        enemy.escaped();
      }
      break;
    case STATUS_ENEMY.ROAMING: {
        setPoints('escapes', 1);
        enemy.escaped();
      }
      break;
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
}

function onSceneClicked(pointer){
  SpawnController.spawnBowl(pointer.x, pointer.y);
}

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

function update (){
  // bgTexture.renderXY(bgSprite, 0, 0, true);
  // bgTexture.renderTexture(bgSprite, true)
  SpawnController.update();
}

const onKeyDown = (e) => {
  switch(e.code){
    case 'Space': SpawnController.slingBowl();
      break;
  }
}

const setPoints = (key, change) => {
  points[key] += change;

  updateScoreboard(key, points[key]);
}

/* Spawn slider thingies */
const initScoreboard = () => {
  scoreElements.bowls = document.querySelector('#score-bowls');
  scoreElements.bites = document.querySelector('#score-bites');
  scoreElements.hugs = document.querySelector('#score-hugs');
  scoreElements.escapes = document.querySelector('#score-escapes');
  scoreElements.captures = document.querySelector('#score-captures');
  scoreElements.total = document.querySelector('#score-total');
}

const updateScoreboard = (key, value) => {
  scoreElements[key].innerHTML = value;
  const total = points.hugs - points.bowls - points.bites;
  scoreElements.total.innerHTML = total;
  if(total > 0){
    scoreElements.total.className = "good"
  }else if (total < 0){
    scoreElements.total.className = "bad"
  }else{
    scoreElements.total.className = ""
  }
}