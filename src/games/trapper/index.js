import Phaser from 'phaser';
import img_blood from '../../assets/blood.png';
import gameData from './data.json';
import { STATUS as STATUS_ENEMY } from './entities/new-raccoon';
import { STATUS as STATUS_PLAYER } from './entities/player';

import SpawnController from './spawn.js';
import LevelController from './level.js';

let game;
let levelGroups;
let emitter;
let sceneContext;
let curLevel = 0;

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
  total: 0
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
}

window.stopGame = () => {[]
  sceneContext.scene.stop();
}

window.startGame = () => {
  sceneContext.scene.start();
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
  return gameData.levels[curLevel];
}

function create() {
  //- make the level
  levelGroups = LevelController.create(getLevel().scene);
  // bgTexture = this.add.renderTexture(this.width, this.height);
  initScoreboard();
  
  //- make the enemies
  const spawnPositions = getLevel().scene.platforms.map(pO => ({
    x: parseInt(pO.x),
    y: parseInt(pO.y) - 50
  }));

  let spawnGroups = SpawnController.create(spawnPositions, gameData.entities, getLevel().scene.platforms);

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
  if(enemy.isAlive){
    if(enemy.status === STATUS_ENEMY.TAME){
      enemy.kill();
    }else{
      enemy.kill();
      setPoints('bites', 1);
    }
  }
}

function trigger_itemAtStart(item, trigger){
  item.destroy();
  setPoints('bowls', 1);
  // enemy.kill();
  // enemy.touched('bowl');
  // enemy.body.x = item.x;
}

function trigger_enemyAndBowl(enemy, bowl){
  if(enemy.canEat() && bowl.canBeEaten){
    enemy.touched(bowl.body);
    // enemy.body.x = bowl.x;
    bowl.touched(enemy);
  }
}


function collider_enemyAndPlatform(enemy, platform){
  // console.log('colliding:', enemy)
  if(enemy.isGoingUp()){
    // console.log('false')
    return false;
  }else{
    // console.log('true')
    return true;
  }
}


function trigger_enemyAndPlayer(enemy, player){
  if(enemy.isAlive){
    if(player.checkStatus(STATUS_PLAYER.HUG_PREP)){
      if(enemy.isFull){
        enemy.hug();
        player.hug();
        setPoints('hugs', 1);
      }else{
        player.hurt();
        setPoints('bites', 1);
      }
    }else if(player.checkStatus(STATUS_PLAYER.KICK_PREP)){
      // enemy.punt ? enemy.punt() : enemy.kill();
    }else if(player.checkStatus(STATUS_PLAYER.KICK) && player.getKickStrength() > 0){
      enemy.punt ? enemy.punt(player.getKickStrength()) : enemy.kill();
    }
  }

  //- anything else, just walk on by
}

function onObjectClicked(pointer, gameObject){
  emitter.setPosition(pointer.worldX, pointer.worldY);
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