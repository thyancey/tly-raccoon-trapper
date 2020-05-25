import Phaser from 'phaser';
import img_blood from '../../assets/blood.png';
import gameData from './data.json';
import { STATUS as enemyStatus } from './entities/raccoon';

import SpawnController from './spawn.js';
import LevelController from './level.js';

let game;
let enemies;
let levelGroups;
let emitter;
let sceneContext;



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

window.stopGame = () => {
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

function create() {
  //- make the level
  levelGroups = LevelController.create(gameData.level);
  
  //- make the enemies
  const spawnPositions = gameData.level.platforms.map(pO => ({
    x: parseInt(pO.x),
    y: parseInt(pO.y) - 50
  }));

  let spawnGroups = SpawnController.create(spawnPositions, gameData.entities);

  this.physics.add.collider(spawnGroups.enemies, levelGroups.platforms);
  this.physics.add.collider(spawnGroups.bowls, levelGroups.platforms);
  this.physics.add.overlap(spawnGroups.enemies, spawnGroups.bowls, trigger_enemyBowl, null, this);
  this.physics.add.overlap(spawnGroups.bowls, levelGroups.leftTrigger, trigger_itemAtStart, null, this);
  this.physics.add.overlap(spawnGroups.enemies, levelGroups.rightTrigger, trigger_enemyAtEnd, null, this);

  this.input.on('gameobjectdown', onObjectClicked);
  this.input.on('pointerdown', onSceneClicked);


  setupMouseEmitter();
}

function trigger_enemyAtEnd(enemy, trigger){
  if(enemy.status === enemyStatus.TAME){
    enemy.ascend();
  }else{
    enemy.kill();
  }
}

function trigger_itemAtStart(item, trigger){
  item.destroy();
  // enemy.kill();
  // enemy.touched('bowl');
  // enemy.body.x = item.x;
}

function trigger_enemyBowl(enemy, bowl){
  if(bowl.canBeEaten){
    enemy.touched('bowl');
    // enemy.body.x = bowl.x;
    bowl.touched(enemy);
  }
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
  SpawnController.update();
}