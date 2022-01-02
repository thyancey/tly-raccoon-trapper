import Phaser from 'phaser';

import gameData from './data.json';
import { STATUS as STATUS_ENEMY } from './entities/raccoon';
import { STATUS as STATUS_PLAYER } from './entities/player';
import Events from '../event-emitter';
import SpawnController, { spawnStatus } from './spawn.js';
import LevelController from './level.js';

let game;
let levelGroups;
let sceneContext;

const INITIAL_STATE_POINTS = {
  bowls: 0,
  hugs: 0,
  bites: 0,
  captures: 0,
  escapes: 0 
}
let points = {};

global.gameData = {
  curLevel: 0
}

const particleDefs = {
  blood: {
    image:'./assets/blood.png',
    emitter:{
      quantity: 20,
      visible: false,
      blendMode: 'SCREEN',
      speed: { min: -400, max: 400 },
      angle: { min: 210, max: 330 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      gravityY: 1000
    }
  },
  raccoon: {
    atlas:'./assets/sprites/particle-raccoon',
    sound: 'splat1',
    emitter:{
      quantity: 7,
      frame: { frames: [ 'particle-raccoon0', 'particle-raccoon1', 'particle-raccoon2', 'particle-raccoon3', 'particle-raccoon4', 'particle-raccoon5', 'particle-raccoon6' ], cycle: true },
      frequency:1,
      visible: false,
      speed: { min: 400, max: 600 },
      angle: { min: 210, max: 330 },
      scale: { start: 1.5, end: 2 },
      lifespan: { min: 400, max: 800 },
      gravityY: 2000
    }
  },
  raccoon_mean: {
    atlas:'./assets/sprites/particle-raccoon',
    sound: 'splat1',
    emitter:{
      quantity: 7,
      frame: { frames: [ 'particle-raccoon0', 'particle-raccoon1', 'particle-raccoon2', 'particle-raccoon3', 'particle-raccoon4', 'particle-raccoon5', 'particle-raccoon6' ], cycle: true },
      frequency:1,
      visible: false,
      tint: 0xff0000,
      speed: { min: 300, max: 500 },
      angle: { min: 210, max: 330 },
      scale: { start: .75, end: 1.1 },
      lifespan: { min: 400, max: 800 },
      gravityY: 2000
    }
  }
}
const particles = {}
/*
class AnimatedParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);
        this.frame = anim.frames

        this.t = 0;
        this.i = 0;
    }

    update (delta, step, processors)
    {
        var result = super.update(delta, step, processors);

        this.t += delta;

        if (this.t >= anim.msPerFrame)
        {
            this.i++;

            if (this.i > 17)
            {
                this.i = 0;
            }

            this.frame = anim.frames[this.i].frame;
            this.t -= anim.msPerFrame;
        }

        return result;
    }
}
*/

export const createGame = () =>{
  console.log('GAME: createGame');
  points = { ...INITIAL_STATE_POINTS };

  const config = {
    type: Phaser.AUTO,
    scale: {
      parent: 'game-container',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 900,
      height: 500,
      min: {
        width: 90,
        height: 50
      },
      max: {
        width: 1600,
        height: 1200
      },
      zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
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
  setSceneContext(this);

  // sounds/music
  this.load.audioSprite('sfx', './assets/sfx/mixdown.json', [ 'assets/sfx/splat.ogg', 'assets/sfx/splat.mp3'] );
  this.load.audioSprite('sfx_jab', './assets/sfx/jab.json', [ 'assets/sfx/jab.ogg', 'assets/sfx/jab.mp3'] );

  // particle images
  Object.keys(particleDefs).forEach(k => {
    if(particleDefs[k].image){
      this.load.image(`particle_${k}`, particleDefs[k].image);
    } else if(particleDefs[k].atlas) {
      this.load.atlas(`particle_${k}`, `${particleDefs[k].atlas}.png`, `${particleDefs[k].atlas}.json`);
    }
  });

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

  addParticles();
}
function update (){
  SpawnController.update();
}

function onInterface(event, data){
  global.gameInterface && global.gameInterface(event, data)
}

function trigger_enemyAtEnd(enemy, trigger){
  switch(enemy.status){
    case STATUS_ENEMY.ROAMING_TAME:
      spawnStatus('tame', enemy.body.x, enemy.body.y);
      setPoints('captures', 1);
      enemy.captured();
      break;
    case STATUS_ENEMY.ROAMING:
      spawnStatus('lost', enemy.body.x, enemy.body.y);
      setPoints('escapes', 1);
      enemy.escaped();
      break;
    default: break;
  }
}

function trigger_itemAtStart(item, trigger){
  spawnStatus('lost', item.body.x, item.body.y);
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
    // first off, is player is kicking, punt that thing
    if(player.checkStatus(STATUS_PLAYER.KICK) && player.getKickStrength() > 0){
      kickEnemy(player, enemy);
    }else{
    // otherwise, see if its good or bad
      // get bitten by mean boys.
      if(!enemy.isFull && !enemy.checkStatus(STATUS_ENEMY.BITING)){
        spawnStatus('bite', enemy.body.x, enemy.body.y, enemy.depth);
        bitePlayer(player, enemy);
      }else{
        // good raccoons get a bonus from a hug, dont hug more than once now
        if(player.checkStatus(STATUS_PLAYER.HUGGING) && !enemy.checkStatus(STATUS_ENEMY.HUGGING)){
          spawnStatus('hug', enemy.body.x, enemy.body.y, enemy.depth);
          hugEnemy(player, enemy);
        }
        // already got your hug lil dude, move along
      }
    }
  }

  //- anything else, just walk on by
}

function kickEnemy(player, enemy){
  const kickStrength = player.getKickStrength();
  if(enemy.punt){
    if(!enemy.punted){
      const willKill = (kickStrength >= enemy.puntKillThreshold);
      enemy.punt(kickStrength);
      if(willKill){
        showParticle('blood', enemy.body.x, enemy.body.y);
        if(enemy.particleDeath) showParticle(enemy.particleDeath,  enemy.body.x, enemy.body.y);
        
        enemy.kill(true);
      }else{
        // soft punt sound
        const thudVolume = .3 * kickStrength
        game.sound.playAudioSprite('sfx_jab', 'jab01', { volume: thudVolume });
      }
    }
  }else{
    showParticle('blood',  enemy.body.x, enemy.body.y);
    if(enemy.particleDeath) showParticle(enemy.particleDeath,  enemy.body.x, enemy.body.y);
    enemy.kill(true);
  }
}

function hugEnemy(player, enemy){
  enemy.hug();
  player.onHugEnemy();
  setPoints('hugs', 1);
}

function bitePlayer(player, enemy){
  enemy.bite();
  player.onAttackedByEnemy();
  setPoints('bites', 1);
}

function onObjectClicked(pointer, gameObject){
  if(gameObject.type === 'raccoon'){
    gameObject.clicked();
    showParticle('blood', pointer.worldX, pointer.worldY);
    if(gameObject.particleDeath) showParticle(gameObject.particleDeath,  pointer.worldX, pointer.worldY);
  }
}

function showParticle(type, x, y){
  const pDef = particleDefs[type];
  let config = pDef.emitter;

  let pEmitter = particles[type].createEmitter(config);

  pEmitter.setPosition(x, y);
  pEmitter.explode();
  pEmitter.visible = true;
  if(pDef.sound){
    game.sound.playAudioSprite('sfx', pDef.sound);
  }
}

function addParticles(){
  Object.keys(particleDefs).forEach(k => {
    particles[k] = sceneContext.add.particles(`particle_${k}`);
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
  Events.emit('interface', 'setMetric', { 'key': key, 'value': value });
}


export const externalCommand = (event, payload) => {
  console.log('externalCommand:', event, payload);
}

export const pauseGame = () => {
  console.log('GAME: pauseGame');
  sceneContext?.scene?.pause();
}

export const resumeGame = () => {
  console.log('GAME: resumeGame');
  if(global.gameActive){
    sceneContext?.scene?.resume();
  }
}

export const killGame = () => {
  console.log('GAME: killGame');
  if(global.gameActive){
    global.stopGame();
    game.destroy();
    game = null;
    sceneContext = null;
    levelGroups = null;
  }
}