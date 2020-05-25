import Phaser from 'phaser';
import img_blood from './assets/blood.png';

import SpawnController from './controllers/spawn-controller';
import LevelController from './controllers/level-controller';

let game;
let enemies;
let platforms;
let emitter;
let sceneContext;

export const createGame = (jsonData) =>{
  console.log('jsonData is ', jsonData);
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
  platforms = LevelController.create();
  
  //- make the enemies
  let spawnGroups = SpawnController.create(this, enemies);

  this.physics.add.collider(spawnGroups.enemies, platforms);
  this.physics.add.collider(spawnGroups.items, platforms);
  this.physics.add.overlap(spawnGroups.enemies, spawnGroups.items, touchItem, null, this);

  this.input.on('gameobjectdown', onObjectClicked);
  this.input.on('pointerdown', onSceneClicked);


  setupMouseEmitter();
}

function touchItem(enemy, item){
  enemy.touched('bowl');
  enemy.body.x = item.x;
}


function onObjectClicked(pointer, gameObject){
  emitter.setPosition(pointer.worldX, pointer.worldY);
  emitter.explode(20);
  emitter.visible = true;
}

function onSceneClicked(pointer){
  SpawnController.spawn('items', 'bowl', 'foodBowl_full', pointer.x, pointer.y);
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