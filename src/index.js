import Phaser from "phaser";
import img_blood from "./assets/blood.png";
import './style.scss';

import { spawn_update, spawn_preload, spawn_create } from './spawn-manager';

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

const game = new Phaser.Game(config);
let emitter;

function preload() {
  this.load.image('blood', img_blood);
  spawn_preload(this);

}

function onObjectClicked(pointer, gameObject){
  emitter.setPosition(pointer.worldX, pointer.worldY);
  emitter.explode(20);
  emitter.visible = true;
}

function create() {
  spawn_create(this);


  this.input.on('gameobjectdown', onObjectClicked);

  var particles = this.add.particles('blood');

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

function update ()
{
  spawn_update();
}